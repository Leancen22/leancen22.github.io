const socket = io.connect()

// socket.on('from-server-mensajes', mensajes => {
//     console.log(mensajes)
//     render(mensajes)
// })

// socket.on('from-server-productos', productos => {
//     console.log(productos)
//     render_productos(productos)
// })
//
// function render(mensajes) {
//
//     const cuerpoMensajesHTML = mensajes.map(msj => {
//         return `
//             <span><b style="color: blue;">${msj.user}</b> <span style="color: brown;">[${msj.fecha_actual}]</span>:</span><span style="color: green; font-style: italic;"> ${msj.mensaje}</span>
//         `
//     }).join('<br>')
//
//     document.querySelector('#historialChat').innerHTML = cuerpoMensajesHTML
//
// }
//
// function render_productos(productos) {
//     const cuerpoMensajesHTML = productos.map(prod => {
//         return `
//             <tr>
//                 <td>${prod.title}</td>
//                 <td>${prod.price}</td>
//                 <td><img src="${prod.thumbnail}" width="30"></td>
//                 <td style="display: flex; text-align: center; justify-content: center;
//                 margin: auto 0;"><button data-id="${prod._id}" class="btn btn-success agregar" >Agregar al Carrito</button></td>
//             </tr>
//         `
//     }).join('')

//     document.querySelector('#historialProductos').innerHTML = cuerpoMensajesHTML
// }





//Agrega productos al carrito


const producto_especifico = document.querySelectorAll('.agregar')
producto_especifico.forEach( (btn) => {
    btn.addEventListener('click', async (e) => {             

        const producto = {
            id: e.target.dataset.id,
            title: e.target.parentElement.children[0].textContent,
            price: e.target.parentElement.children[1].textContent,
            thumbnail: e.target.parentElement.querySelector('img').src,
            cantidad: 1
        };

        await fetch('/carrito/productos', {
            method: 'POST',
            body: JSON.stringify(producto),
            headers: {
                'Content-Type': 'application/json',
            }
        });

    })
})

//Elimina productos del carrito

const producto_eliminar = document.querySelectorAll('.eliminar')
producto_eliminar.forEach( (btn) => {
    btn.addEventListener('click', async (e) => {             

        await fetch(`/carrito/productos/${e.target.dataset.id}`, {
            method: 'DELETE',
        });

    })
})




















//
// function enviarMensaje () {
//     const inputUser = document.querySelector('#user')
//     const inputContenido = document.querySelector('#contenidoMensaje')
//
//     const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
//
//     const mensaje = {
//         author: inputUser.value,
//         text: inputContenido.value
//     }
//
//     if (emailRegex.test(inputUser)) {
//         socket.emit('from-client-mensaje', mensaje)
//     }
// }
//
// function enviarProducto () {
//     const inputNombre = document.querySelector('#title')
//     const inputPrecio = document.querySelector('#price')
//     const inputFoto = document.querySelector('#thumbnail')

//     const producto = {
//         title: inputNombre.value,
//         price: inputPrecio.value,
//         thumbnail: inputFoto.value
//     }

//     socket.emit('from-client-producto', producto)
// }

const schemaAuthor = new normalizr.schema.Entity('author', {}, {idAttribute: 'id'})
const schemaMensaje = new normalizr.schema.Entity('post', {author: schemaAuthor}, {idAttribute: '_id'})
const schemaMensajes = new normalizr.schema.Entity('posts', { mensajes: [schemaMensaje] }, {idAttribute: 'id'})


// socket.on('mensajes', mensaje => {
//     console.log(mensaje)
//     render(mensaje)
// })
socket.on('mensajes', mensajesN => {
    let mensajesNSize = JSON.stringify(mensajesN).length
    console.log(mensajesNSize, mensajesN)

    let mensajesD = normalizr.denormalize(mensajesN.result, schemaMensajes, mensajesN.entities)
    let mensajesDsize = JSON.stringify(mensajesD).length

    let porcentajeC = parseInt((mensajesNSize * 100) / mensajesDsize)
    console.log(`${porcentajeC}%`)

    document.querySelector('#porcentaje').innerHTML = `<h4>Porcentaje de compresión: <b> ${porcentajeC}%</b></h4>`

    console.log(mensajesD.mensajes)
    render(mensajesD.mensajes)
})

function enviarMensaje () {
    const inputMensaje = document.getElementById('contenidoMensaje')
    const PublicarMensaje = document.getElementById('btnEnviar')

    const mensaje = {
        author: {
            email: document.getElementById('email').value,
            nombre: document.getElementById('firstname').value,
            apellido: document.getElementById('lastname').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value,
        },
        text: document.getElementById('contenidoMensaje').value
    }

    console.log(mensaje)
    socket.emit('nuevoMensaje', mensaje)
}

function render(mensaje) {

    const cuerpoMensajesHTML = mensaje.map(msj => {
        return `
            <span><b style="color: blue;">${msj.author['email']}</b> <span style="color: brown;">[${msj.fyh}]</span>:</span><span style="color: green; font-style: italic;"> ${msj.text} <img src='${msj.author['avatar']}' width="30px"/></span>
        `
    }).join('<br>')

    document.querySelector('#historialChat').innerHTML = cuerpoMensajesHTML

}


