import ContainerArchivo from "../../Containers/ContainerArchivo.js";

class DaoMensajesArchivo extends ContainerArchivo {
    constructor() {
        super('./mensajes.json');
    }
}

export default DaoMensajesArchivo