class ContainerMemoria {
    constructor() {
        this.memoria =[]
    }

    guardar(objeto) {
        let newId
        if(this.memoria.length == 0) {
            newId = 1
        } else {
            newId = this.memoria[this.memoria.length - 1].id + 1
        }

        this.memoria.push({id: newId, ...objeto})
        return `Nuevo elemento agregado con id ${newId}`
    }

    listar(id) {
        const obj = this.memoria.find(obj => obj.id == id)
        if (obj) {
            return obj
        } else {
            return 'No se encontro'
        }
    }

    listarAll() {
        return this.memoria
    }

    actualizar(id, objeto) {
        const obj = this.memoria.findIndex(obj => obj.id == id)
        this.memoria[obj] = {...this.memoria[obj] , ...objeto}
        return this.memoria
    }

    borrar(id) {
        this.memoria = this.memoria.filter(obj => obj.id != id)
        return 'Borrado'
    }

    borrarAll() {
        this.memoria = []
        return 'Todos los elementos borrados'
    }
}

// function main() {
//     const m = new ContainerMemoria()
//     console.log(m.listarAll())
//     m.guardar({'nombre': 'Leandro'})
//     m.guardar({'nombre': 'Lucia'})
//     m.guardar({'nombre': 'Carlos'})
//     console.log(m.listarAll())
//     console.log(m.listar(4))
//
//     m.actualizar(1,{'nombre': 'Leandro Actualizado'})
//     console.log(m.listarAll())
//     m.borrar(2)
//     console.log(m.listarAll())
//     m.borrar(2)
//     console.log(m.listar(1))
//     console.log(m.listarAll())
//     m.borrarAll()
//     console.log(m.listarAll())
//
// }
// main()

export default ContainerMemoria