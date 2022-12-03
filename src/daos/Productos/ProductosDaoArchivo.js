import ContainerArchivo from "../../Containers/ContainerArchivo.js";

class ProductosDaoArchivo extends ContainerArchivo {
    constructor(archivo) {
        super('./DB/productos.json');
    }
}

export default ProductosDaoArchivo