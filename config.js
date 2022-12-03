const config = {
    modo: 'mongo',
    mongo: {
        host: 'localhost',
        port: 27017,
        dbName: 'ecommerce',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    firebase: {
        
    }
}

export default config