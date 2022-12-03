import express from 'express'
const testProductos = express.Router()

import {faker} from "@faker-js/faker";
faker.locale = 'es'

testProductos.get('/', (req, res) => {
    const CANT_PROD = 5
    const productos = []
    for (let index = 1; index <= CANT_PROD; index ++) {
        const prod = {
            id: index,
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: `${faker.image.imageUrl()}?${index}`
        }
        productos.push(prod)
    }
    console.log(productos)
    res.render('productos', {productos})
})

export default testProductos