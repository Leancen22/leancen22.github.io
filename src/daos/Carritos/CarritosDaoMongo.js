import ContainerMongo from "../../Containers/ContainerMongo.js";

class CarritosDaoMongo extends ContainerMongo {
    constructor() {
        super('carritos', {
            productos: {type: [], required: true},
            email: {type: String, require: true}
        });
    }

    async guardar(carrito = { productos: [] }) {
        return super.guardar(carrito)
    }

    async listarUno(objeto) {
        try {
          return await this.collecion.findOne(objeto);
        } catch (error) {
          console.log(error);
        }
    }

    async agregarProducto(email, elem) {
        try {
            await this.collecion.updateOne({ email }, { $push: { productos: elem } })
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProducto(email, id) {
        try {
          await this.collecion.updateOne({ email }, { $pull: { productos: { id } } });
        } catch (error) {
          logError(error);
        }
    }

}

export default CarritosDaoMongo