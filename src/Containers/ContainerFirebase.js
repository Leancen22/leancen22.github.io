import admin from 'firebase-admin'
import config from "../../config.js";
import fs from "fs/promises";

admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore()

class ContainerFirebase {
    constructor(nombreCollecion) {
        this.collection = db.collection(nombreCollecion)
    }

    async guardar(objeto) {
        try {
            const guardado = await this.collection.add(objeto)
            return {...objeto, id: guardado.id}
        } catch (e) {
            throw new Error(`Error al guardar ${e}`)
        }
    }

    async listar(id) {
        try {
            const doc = await this.collection.doc(id).get()
            if (!doc.exists) {
                throw new Error(`Error al listar`)
            } else {
                const data = doc.data()
                return {...data, id}
            }
        } catch (e) {
            throw new Error(`Error al listar por id ${e}`)
        }
    }

    async listarAll() {
        try {
            const result = []
            const snapshot = await this.collection.get()
            snapshot.forEach(doc => {
                result.push({id: doc.id, ...doc.data()})
            })
            return result
        } catch (e) {
            throw new Error(`Error al listar ${e}`)
        }
    }

    async actualizar(id, objeto) {
        try {
            console.log(id)
            const snapshot = await this.collection.doc(`${id}`)
            let actualizado = await snapshot.update({...objeto})
            return actualizado
        } catch (e) {
            throw new Error(`Error al actualizar por id ${e}`)
        }
    }

    async borrar(id) {
        try {
            const snapshot = await this.collection.doc(`${id}`)
            await snapshot.delete()
            return 'Producto removido correctamente'
        } catch (e) {
            throw new Error(`Error al borrar por id ${e}`)
        }
    }

    async borrarAll() {
        try {
            const docs = await this.listarAll()
            const ids = docs.map(d => d.id)
            const promesas = ids.map(id => this.borrar(id))
            return 'Todos los productos.pug removidos correctamente'
        } catch (e) {
            throw new Error(`Error al borrar ${e}`)
        }
    }
}

export default ContainerFirebase