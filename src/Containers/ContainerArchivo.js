import fs from 'fs/promises'

class ContainerArchivo {
    constructor(archivo) {
        this.archivo = archivo
    }

    async guardar(objeto) {

        const archivo = await this.listarAll()

        let newId
        if (archivo.length == 0) {
            newId = 1
        } else {
            newId = archivo[archivo.length - 1].id + 1
        }

        archivo.push({id: newId, ...objeto})

        await fs.writeFile(this.archivo, JSON.stringify(archivo, null, 2))
    }

    async listar(id) {
        try {
            const objeto = await this.listarAll()
            return objeto.find( obj => obj.id == id )
        } catch (error) {
            throw new Error(`Ha ocurrido un error al lista el elemento ${id}: ${error}`)
        }
    }

    async listarAll() {
        try {
            const archivo = await fs.readFile(this.archivo, 'utf-8')
            return JSON.parse(archivo)
        } catch ( e ) {
            return []
        }
    }

    async actualizar(id, objeto) {
        const archivo = await this.listarAll()
        const index = archivo.findIndex(o => o.id == id)
        if (index != -1) {
            archivo[index] = {...archivo[index], ...objeto}
            await fs.writeFile(this.archivo, JSON.stringify(archivo, null, 2))
            return 'Actualizado'
        } else {
            return 'No se encontro el elemento'
        }
    }

    async borrar(id) {
        try {
            const archivo = await this.listarAll()
            const elementos = archivo.filter(o => o.id != id)
            await fs.writeFile(this.archivo, JSON.stringify(elementos, null, 2))
            return 'Elemento borrado'
        } catch ( e ) {
            return 'No se encontro'
        }
    }

    async borrarAll() {
        await fs.writeFile(this.archivo, [])
    }

}

// async function main() {
//     const a = new ContainerArchivo('./productos.pug.json')
//     console.log(await a.listar(3))
//
// await a.actualizar(2, { nombre: 'Regla'})
// console.log(await a.listarAll())
// await a.guardar({ nombre: 'Escuadra'})
// }
// main()

export default ContainerArchivo