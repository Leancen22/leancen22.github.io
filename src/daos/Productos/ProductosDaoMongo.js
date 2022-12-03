import ContainerMongo from "../../Containers/ContainerMongo.js";

class ProductosDaoMongo extends ContainerMongo {
    constructor(nombreColeccion, esquema) {
        super('productos', {
            title: {type: String, required: true},
            price: {type: Number, required: true},
            thumbnail: {type: String, required: true},
        });
    }
}

export default ProductosDaoMongo