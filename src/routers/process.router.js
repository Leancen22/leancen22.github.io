import express from 'express'
const processRouter = express.Router()

import compression from 'compression'

import {fork} from 'child_process'
const forkProcess = fork('./utils/randoms.js')

processRouter.get('/info', compression(), (req, res) => {
    let datos = {
        'Argumentos de entrada': process.argv.slice(2),
        'Path de ejecucion': process.execPath,
        'Nombre de la plataforma': process.platform,
        'Process id': process.pid,
        'Version de node.js': process.version,
        'Carpeta del proyecto': process.cwd(),
        'Memoria total reservada (rss)': process.memoryUsage().rss,
    }
    res.json(datos)
})

processRouter.get('/info-no', (req, res) => {
    let datos = {
        'Argumentos de entrada': process.argv.slice(2),
        'Path de ejecucion': process.execPath,
        'Nombre de la plataforma': process.platform,
        'Process id': process.pid,
        'Version de node.js': process.version,
        'Carpeta del proyecto': process.cwd(),
        'Memoria total reservada (rss)': process.memoryUsage().rss,
    }
    res.json(datos)
})

processRouter.get('/api/randoms', (req, res) => {
    //Se define la cantidad de veces que se generaran numeros
    let cant = 100000000;
    if (req.query.cant) cant = req.query.cant;

    const forkProcess= fork('./utils/randoms.js');

    //Espera la bandera del archivo que se ejecuta en paralelo, mientras no la encuentre envia los numeros, recibidos de randoms.js al front, cuando lo recibe manda cant al proceso.
    forkProcess.on('message', msg => {
        if (msg == 'Proceso terminado') {
            forkProcess.send({ cant })
        } else {
            res.json(msg.numeros);
        }
    });
})

export default processRouter