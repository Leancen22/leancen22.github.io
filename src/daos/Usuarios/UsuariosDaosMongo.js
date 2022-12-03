import ContainerMongo from "../../Containers/ContainerMongo.js";

class UsuariosDaosMongo extends ContainerMongo {
    constructor(nombreColeccion, esquema) {
        super('usuarios', {
            username: {type: String, require: true},
            password: {type: String, require: true},
            email: {type: String, require: true},
            telefono: {type: Number, require: true},
            edad: {type: Number, require: true},
            direccion: {type: String, require: true},
            avatar: {type: String, require: true}
        })
    }
}

export default UsuariosDaosMongo