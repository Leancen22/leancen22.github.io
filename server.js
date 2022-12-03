import express from "express"
import cookieParser from "cookie-parser"
import session from 'express-session'
import compression from "compression"
import cluster from "cluster"
import os from 'os'
import parseArgs from 'minimist';
import { fork } from "child_process"
import bcrypt from 'bcrypt';
import {normalize, schema} from "normalizr";
import nodemailer from 'nodemailer'

import dotenv from 'dotenv'
dotenv.config()

import {faker} from "@faker-js/faker";
faker.locale = 'es'

import FileStoreLib from 'session-file-store'
const FileStore = FileStoreLib(session)

import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;

import {Server as HttpServer} from 'http'
import {Server as socket} from "socket.io";


const app = express()
const httpServer = new HttpServer(app)
const io = new socket(httpServer)

import { logger, Ruta, NoImplementada } from "./utils/logger.config.js"
import processRouter from './src/routers/process.router.js'
import testProductos from "./src/routers/test_productos.router.js"
import ContenedorArchivo from './src/Containers/ContainerArchivo.js'
import {ProductoDao, UsuarioDao, CarritoDao} from "./src/index.js";

app.use('/', processRouter)
app.use('/api/productos_test', testProductos)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(cookieParser(`${process.env.SECRET}`))
app.use(compression())

const mensajesApi = new ContenedorArchivo('./DB/mensajes.json')


app.set('views', './views')
app.set('view engine', 'pug')

passport.use(new LocalStrategy(
    async function(username, password, done) {
        const usuarios = await UsuarioDao.listarAll()
        const usuario = usuarios.find(usr => usr.email == username)

        if (!usuario) {
            return done(null, false)
        } else {
            const match = await verifyPass(usuario, password)
            if ( !match ) {
                return done(null, false)
            }
            return done(null, usuario)
        }
    }
));

passport.serializeUser((usuario, done) => {
    done(null, usuario.username)
})

passport.deserializeUser(async (nombre, done) => {
    const usuarios = await UsuarioDao.listarAll()
    const usuario = usuarios.find(usr => usr.username == nombre)
    done(null, usuario)
})

//Persistencia en mongo
import connectMongo from 'connect-mongo'
const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_ATLAS,
    ttl: 60
})

app.use(session({   
    store: MongoStore,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60 //20 seg
    },
    //rolling: true
}))

app.use(passport.initialize());
app.use(passport.session());

async function generateHashPassword(password){
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
}

async function verifyPass(username, password) {
    const match = await bcrypt.compare(password, username.password);
    console.log(`pass login: ${password} || pass hash: ${ username.password}`)
    return match;
}

function isAuth(req, res, next) {
    if(req.isAuthenticated()){
        next()
    } else {
        res.redirect('/login')
    }
}

/*--------------------------------------------------------------------------------------------*/

app.get('/', async (req, res) => {
    res.redirect('/login')
})

app.get('/vista', isAuth, async (req, res) => {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    const username = req.user.username
    const email = req.user.email
    const avatar = req.user.avatar

    if (req.user) {

        const productos = await ProductoDao.listarAll();

        console.log(productos)
        res.render('vista', {username, email, avatar, productos})
    } else {
        res.redirect('/login')
    }
})

/*---------------------------------------------------*/


app.get('/login', (req, res) => {
    if(req.user) {
        res.redirect('/vista')
    } else {
        res.render('login')
    }
})

app.get('/error-login', (req, res) => {
    res.render('error-login')
})

app.get('/error-registro', (req, res) => {
    res.render('error-registro')
})

app.post('/login', passport.authenticate('local',  {successRedirect: '/vista', failureRedirect: '/error-login'} ));

app.get('/registro', (req, res) => {
    res.render('registro')
})

app.post('/registro', async (req, res) => {
    const {username, password, email, telefono, edad, direccion, avatar} = req.body

    const usuarios = await UsuarioDao.listarAll()
    const usuario = usuarios.find(usr => usr.email == email)
    if (usuario) {
        res.redirect('/error-registro')
    } else {
        await UsuarioDao.guardar({username, password: await generateHashPassword(password), email, telefono, edad, direccion, avatar})
        res.redirect('/login')
    }
})

//
// app.get('/privado', auth, (req, res) => {
//     res.send('Se encuentra loguado')
// })
//
app.get('/logout', (req, res) => {
    const username = req.session.username
    req.session.destroy(err => {
        if(err) {
            res.json({err})
        } else {
            res.render('login')
        }
    })

})

app.get('/logout_timeout', (req, res) => {
    res.render('logout_timeout', {})
})

/* ----------------- carrito ---------------- */

// const generarCarrito = async req => {
//     if (!req.isAuthenticated()) return [];

//     const email = req.user.email;
//     const carrito = await CarritoDao.listarUno({ email });
//     return carrito
//       ? carrito.productos
//       : carrito;
//   };

app.get('/carrito', isAuth, async (req, res) => {

    const email = req.user.email
    const carrito = await CarritoDao.listarUno({ email })

    if (carrito == null) {
        await CarritoDao.guardar({email, productos: []})  
    }
    console.log(carrito, carrito.productos.length)

    const valores_carrito = carrito.productos

    res.render('carrito', {valores_carrito})
})

app.post('/carrito', async (req, res) => {
    await CarritoDao.guardar({productos: []})
    res.json({code: 201, msg: 'Nuevo producto agregado'})
})

app.post('/carrito/productos', async (req, res) => {
    try {
        console.log(req.body)
        const producto = req.body
        const email = req.user.email
        await CarritoDao.agregarProducto(email, producto)
    } catch (error) {
        res.json({code: 500, msg: `Error al agregar producto al carrito ${error}`})
    }
})

app.delete('/carrito/productos/:id', async (req, res) => {
    const id_producto = req.params.id
    const email = req.user.email

    console.log(id_producto, email)

    if (id_producto) {
        await CarritoDao.deleteProducto(email, id_producto)
    }
    res.end()
})


/*---------------------------------------------------*/

app.post('/productos', async (req, res) => {
    try {
        Ruta(req)
        await ProductoDao.guardar({...req.body})
        res.redirect('/vista')
    } catch (error) {
        logger.error(`Ha ocurrido un error ${error}`)
    }
})

app.get('*', (req, res) => {
    let ruta = req.url
    // logger.warn(`Ruta ${ruta} con metodo ${req.method} no implementada`)
    NoImplementada(req)
    res.send('ruta no implementada')
})

const schemaAuthor = new schema.Entity('author', {}, {idAttribute: 'email'})
const schemaMensaje = new schema.Entity('post', { author: schemaAuthor }, {idAttribute: 'id'})
const schemaMensajes = new schema.Entity('posts', { mensajes: [schemaMensaje] }, {idAttribute: 'id'})

const normalizarMensaje = (mensajesConId) => normalize(mensajesConId, schemaMensajes)


io.on('connection', async (socket) => {
    console.log(`Un nuevo cliente se conecto ${socket.id}`)

    //const elem = await listarMensajesNormalizados()
    //console.log(util.inspect(elem, false, 12, true))

    io.sockets.emit('mensajes', await listarMensajesNormalizados())
    //socket.emit('mensajes', await mensajesApi.listarAll())

    const productos = await ProductoDao.listarAll()
    io.sockets.emit('from-server-productos', productos)

    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await mensajesApi.guardar(mensaje)
        console.log(mensaje)
        logger.error(`Ha ocurrido un error en mensajes`)
        io.sockets.emit('mensajes', await listarMensajesNormalizados())
        //socket.emit('mensajes', await mensajesApi.listarAll())
    })

    socket.on('from-client-producto', producto => {
        productos.push(producto)
        io.sockets.emit('from-server-productos', productos)
    })
})

async function listarMensajesNormalizados() {
    const mensajes = await mensajesApi.listarAll()
    const normalizados = normalizarMensaje({id: 'mensajes', mensajes})
    return normalizados
}

const options = { default: { port: 8080, modo: 'fork' }, alias: { p: "port" } };
const args = parseArgs(process.argv.slice(2), options);

const CPU_CORES = os.cpus().length
const PORT = process.env.PORT || 5000
//process.env.PORT || 5000 args.port || process.env.PORT

if ((args.modo == "cluster") && (cluster.isPrimary)) {

    for (let index = 0; index < CPU_CORES; index++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log(`Worker ${process.pid} finished`)
        cluster.fork()
    })

} else {
    const server = httpServer.listen(PORT, () => {
        logger.info(`Runing in port ${PORT} ${process.pid}`)
    })
    server.on('error', error => logger.error(`Error al levantar ${error}`))
}

