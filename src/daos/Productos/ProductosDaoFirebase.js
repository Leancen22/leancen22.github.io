import ContainerFirebase from "../../Containers/ContainerFirebase.js";

class ProductosDaoFirebase extends ContainerFirebase {
    constructor() {
        super('productos');
    }
}

export default ProductosDaoFirebase