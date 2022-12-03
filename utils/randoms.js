//Retortna numeros del 1 al 1000 aleatorios
const numeroAleatorio = () => {
    return Math.floor(Math.random() * 1000 + 1);
};
  
const coincidencias = (cant) => {
    const numeros = {};
    //Se ejecuta cant veces, este parametro es enviado por fork.send
    while (cant > 0) {
        const num = numeroAleatorio();
        //Si se encuentra el numero obtenido por random suma 1 a la cantidad , sino lo define como 1
        numeros[num] ? numeros[num] += 1 : numeros[num] = 1;
        cant -= 1;
    }
    return numeros;
};
  
//Mientras el proceso continua se envian los numeros
process.on('message', msg => {
    const numeros = coincidencias(msg.cant);
    process.send({ numeros });
});

//Proceso finalizado, se usa como bandera
process.send('Proceso terminado');
  