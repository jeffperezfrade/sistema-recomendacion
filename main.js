
// Variable donde se almacenará la matriz de utilidad
let matrizUtilidad = [];

// Lee el archivo donde se encuentra la matriz de utilidad
function leerArchivo(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
      var contenido = e.target.result;
      mostrarContenido(contenido);
    };
    lector.readAsText(archivo);
}
// Muestra la matriz de utilidad en la página
function mostrarContenido(contenido) {
    var elemento = document.getElementById('contenido-archivo');

    // Almacenaje de la matriz de utilidad para poder ser usada
    matrizUtilidad = crearMatriz(contenido.split('\n'));

    // Muestro la matriz de utilidad cargada
    elemento.innerHTML = `<p>Matriz de Utilidad cargada:</p>`;
    elemento.innerHTML += contenido;
}
// Cierra el archivo
document.getElementById('file-input').addEventListener('change', leerArchivo, false);

//Almacenamos el una variable el div que va a contener la matriz resultante final
let resultado = document.querySelector('.resultado');
let elecciones = document.querySelector('.elecciones');

////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////    MAIN    /////////////////////////////////////////////////////////
function ejecutar() {

    // Copia de la matriz de Utilidad
    let matrizCopia = matrizUtilidad;
    
    // Valores de inputs y selectores
    let metrica = document.getElementById('metrica').value;
    let numVecinos = document.getElementById('num-vecinos').value;
    let pre = document.getElementById('prediccion').value;

    // Comprobamos si el número de vecinos es válido para el estudio
    if(numVecinos >= matrizUtilidad.length){
        swal("Error", "El número de vecinos a estudiar debe ser inferior al número de usuarios", "error");
        return -1;
    }
    
    // Ejecutamos dependiendo del tipo de métrica seleccionada
    switch(metrica){
        case 'pearson': {
            for(var i = 0; i < matrizUtilidad.length; i++){
                for(var j = 0; j < matrizUtilidad[i].length; j++){
                    if(matrizUtilidad[i][j] == '-'){
                        let numPrediccion = prediccionPearson(matrizUtilidad, numVecinos, i, j, pre);
                        if(!isNaN(numPrediccion)) matrizCopia[i][j] = parseFloat(numPrediccion.toFixed(2));                        
                    }
                }
            } break;
        }
        case 'coseno': {
            for(var i = 0; i < matrizUtilidad.length; i++){
                for(var j = 0; j < matrizUtilidad[i].length; j++){
                    if(matrizUtilidad[i][j] == '-'){
                        let numPrediccion = prediccionConseno(matrizUtilidad, numVecinos, i, j, pre);
                        if(!isNaN(numPrediccion)) matrizCopia[i][j] = parseFloat(numPrediccion.toFixed(2));                        
                    }
                }
            } break;
        }
        case 'euclidea': {
            for(var i = 0; i < matrizUtilidad.length; i++){
                for(var j = 0; j < matrizUtilidad[i].length; j++){
                    if(matrizUtilidad[i][j] == '-'){
                        let numPrediccion = prediccionEuclidea(matrizUtilidad, numVecinos, i, j, pre);
                        if(!isNaN(numPrediccion)) matrizCopia[i][j] = parseFloat(numPrediccion.toFixed(2));                        
                    }
                }
            } break;
        }
        
    }

    // Mostramos el resultado por pantalla
    imprimirMatriz(matrizUtilidad, matrizCopia);
    
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Funcion para imprimir por pantalla el resultado
function imprimirMatriz(matrizUtilidad, matriz){
    // Limpiamos la pantalla de resultado
    resultado.innerHTML = "";
    for(var i = 0; i < matrizUtilidad.length; i++){
        for(var j = 0; j < matrizUtilidad[i].length; j++)
            if(matriz[i][j] == '-') matriz[i].pop(); 
    }
    
    resultado.innerHTML += `<h3>Matriz resultante: </h3>`;
    // Creamos un elemento tabla donde irá almacenada la matriz resultado
    let tabla = document.createElement("table");

    for(var i = 0; i < matriz.length; i++){
        let tr = document.createElement("tr");
        for(var j = 0; j < matriz[i].length; j++)
            tr.innerHTML += `<td>${matriz[i][j]}</td>`;
        
        tabla.appendChild(tr);
    }
    resultado.appendChild(tabla);
    return matriz;
    
}

// Realiza la prediccion mediante Pearson, ya sea por el tipo de prediccion simple o diferencia con la media
function prediccionPearson(matriz, nVecinos, u, item, pre){
    let vecinosProx = ordenarVecinosPearson(matriz, u);
    let num = den = 0;
    
    switch(pre){
        case 'simple': {
            elecciones.innerHTML += `<h3>Estudio de prediccion para el Item ${item} del Usuario ${u}`;
            for(var i = 0; i < nVecinos; i++){                
                let vecinoActual = vecinosProx[i].vecino;
                if(matriz[vecinoActual][item] != '-') { // Compruebo si el vecino tiene la valoracion del Item
                    num += vecinosProx[i].sim * matriz[vecinoActual][item] ;
                    den += Math.abs(vecinosProx[i].sim);
                    elecciones.innerHTML += `<p>Cálculo del usuario ${u} con el vecino mas próximo ${vecinoActual} con similitud ${vecinosProx[i].sim}</p>`;
                } else if(nVecinos != vecinosProx.length) nVecinos++;
            }
            elecciones.innerHTML += `<p>Predicción: ${num/den}</p>`;
            return num / den;
            break;
        }
        case 'media': {
            elecciones.innerHTML += `<h3>Estudio de prediccion para el Item ${item} del Usuario ${u}`;
            for(var i = 0; i < nVecinos; i++){
                let vecinoActual = vecinosProx[i].vecino;        
                if(matriz[vecinoActual][item] != '-') { // Compruebo si el vecino tiene la valoracion del Item
                    num += vecinosProx[i].sim * (matriz[vecinoActual][item] - media(matriz[vecinoActual]));
                    den += Math.abs(vecinosProx[i].sim);
                    elecciones.innerHTML += `<p>Cálculo del usuario ${u} con el vecino mas próximo ${vecinoActual} con similitud ${vecinosProx[i].sim}</p>`;
                } else if(nVecinos != vecinosProx.length) nVecinos++;
            }
            elecciones.innerHTML += `<p>Predicción: ${media(matriz[u]) + (num / den)}</p>`;
            return media(matriz[u]) + (num / den);
            break;
        }
    }
}
// Realiza la prediccion mediante Distancia Coseno, ya sea por el tipo de prediccion simple o diferencia con la media
function prediccionConseno(matriz, nVecinos, u, item, pre){
    let vecinosProx = ordenarVecinosCoseno(matriz, u);
    let num = den = 0;
    switch(pre){
        case 'simple': {
            elecciones.innerHTML += `<h3>Estudio de prediccion para el Item ${item} del Usuario ${u}`;
            for(var i = 0; i < nVecinos; i++){                
                let vecinoActual = vecinosProx[i].vecino;
                if(matriz[vecinoActual][item] != '-') { // Compruebo si el vecino tiene la valoracion del Item
                    num += vecinosProx[i].sim * matriz[vecinoActual][item] ;
                    den += Math.abs(vecinosProx[i].sim);
                    elecciones.innerHTML += `<p>Cálculo del usuario ${u} con el vecino mas próximo ${vecinoActual} con similitud ${vecinosProx[i].sim}</p>`;
                } else if(nVecinos != vecinosProx.length) nVecinos++;
            }
            elecciones.innerHTML += `<p>Predicción: ${num/den}</p>`;
            return num / den;
            break;
        }
        case 'media': {
            elecciones.innerHTML += `<h3>Estudio de prediccion para el Item ${item} del Usuario ${u}`;
            for(var i = 0; i < nVecinos; i++){
                let vecinoActual = vecinosProx[i].vecino;
                if(matriz[vecinoActual][item] != '-') { // Compruebo si el vecino tiene la valoracion del Item
                    num += vecinosProx[i].sim * (matriz[vecinoActual][item] - media(matriz[vecinoActual]));
                    den += Math.abs(vecinosProx[i].sim);
                    elecciones.innerHTML += `<p>Cálculo del usuario ${u} con el vecino mas próximo ${vecinoActual} con similitud ${vecinosProx[i].sim}</p>`;
                } else if(nVecinos != vecinosProx.length) nVecinos++;
            }
            elecciones.innerHTML += `<p>Predicción: ${media(matriz[u]) + (num / den)}</p>`;
            return media(matriz[u]) + (num / den);
            break;
        }
    }
}
// Realiza la prediccion mediante distancia Euclidea, ya sea por el tipo de prediccion simple o diferencia con la media
function prediccionEuclidea(matriz, nVecinos, u, item, pre){
    let vecinosProx = ordenarVecinosEuclidea(matriz, u);
    let num = den = 0;
    switch(pre){
        case 'simple': {
            elecciones.innerHTML += `<h3>Estudio de prediccion para el Item ${item} del Usuario ${u}`;
            for(var i = 0; i < nVecinos; i++){                
                let vecinoActual = vecinosProx[i].vecino;
                if(matriz[vecinoActual][item] != '-') { // Compruebo si el vecino tiene la valoracion del Item
                    num += vecinosProx[i].sim * matriz[vecinoActual][item] ;
                    den += Math.abs(vecinosProx[i].sim);
                    elecciones.innerHTML += `<p>Cálculo del usuario ${u} con el vecino mas próximo ${vecinoActual} con similitud ${vecinosProx[i].sim}</p>`;
                } else if(nVecinos != vecinosProx.length) nVecinos++;
            }
            elecciones.innerHTML += `<p>Predicción: ${num/den}</p>`;
            return num / den;
            break;
        }
        case 'media': {
            elecciones.innerHTML += `<h3>Estudio de prediccion para el Item ${item} del Usuario ${u}`;
            for(var i = 0; i < nVecinos; i++){
                let vecinoActual = vecinosProx[i].vecino;        
                if(matriz[vecinoActual][item] != '-') { // Compruebo si el vecino tiene la valoracion del Item
                    num += vecinosProx[i].sim * (matriz[vecinoActual][item] - media(matriz[vecinoActual]));
                    den += Math.abs(vecinosProx[i].sim);
                    elecciones.innerHTML += `<p>Cálculo del usuario ${u} con el vecino mas próximo ${vecinoActual} con similitud ${vecinosProx[i].sim}</p>`;
                } else if(nVecinos != vecinosProx.length) nVecinos++;
            }
            elecciones.innerHTML += `<p>Predicción: ${media(matriz[u]) + (num / den)}</p>`;
            return media(matriz[u]) + (num / den);
            break;
        }
    }
}
// Devuelve el valor de la correlacion de pearson entre dos usuarios
function correlacionPearson(u, v){
    // Medias de los usuarios
    let rU = mediaConjunta(u,v)[0];
    let rV = mediaConjunta(u,v)[1];

    // Numerador y denominadores de cada usuario
    let num = denU = denV = 0;
    for(var i = 0; i < u.length; i++){
        if(u[i] != '-' && v[i] != '-'){
            num += (u[i] - rU) * (v[i] - rV);
            denU += Math.pow((u[i] - rU),2);
            denV += Math.pow((v[i] - rV),2);
        }
    }
    let Pearson = num / (Math.sqrt(denU) * Math.sqrt(denV));
    return Pearson;
}

// Ordena los vecinos mas próximos en similitud mediante la Correlación de Pearson
function ordenarVecinosPearson(matriz, u){
    // Objeto donde se almacena el indice del vecino y su correlacion de pearson con el usuario activo
    let vecinosProxPearson = [];
    for(var i = 0; i < matriz.length; i++){
        if(u != i) // Nos aseguramos que usuario != vecino
            vecinosProxPearson.push({"vecino": i, "sim": correlacionPearson(matriz[u],matriz[i])}); // Agregamos la tupla
    }
    // Ordenamos los vecinos por similitud
    let vecinosOrdenados = vecinosProxPearson.slice(0);
    vecinosOrdenados.sort(function(a,b) {
        return b.sim - a.sim; // Ordenamos de mayor a menor
    });
    return vecinosOrdenados;
}

// Devuelve el valor de similitud mediante la Distancia Coseno entre dos usuarios
function distanciaCoseno(u, v){
    let num = denU = denV = 0;

    for(var i = 0; i < u.length; i++){
        if(u[i] != '-' && v[i] != '-'){
            num += u[i] * v[i];
            denU += Math.pow(u[i],2);
            denV += Math.pow(v[i],2);
        }
    }
    let Coseno = num / (Math.sqrt(denU) * Math.sqrt(denV));
    return Coseno;
}

// Ordena los vecinos mas próximos en similitud mediante la Correlación de Pearson
function ordenarVecinosCoseno(matriz, u){
    // Objeto donde se almacena el indice del vecino y su correlacion de pearson con el usuario activo
    let vecinosProxCoseno = [];
    for(var i = 0; i < matriz.length; i++){
        if(u != i) // Nos aseguramos que usuario != vecino
            vecinosProxCoseno.push({"vecino": i, "sim": distanciaCoseno(matriz[u],matriz[i])}); // Agregamos la tupla
    }
    // Ordenamos los vecinos por similitud
    let vecinosOrdenados = vecinosProxCoseno.slice(0);
    vecinosOrdenados.sort(function(a,b) {
        return b.sim - a.sim; // Ordenamos de mayor a menor
    });
    return vecinosOrdenados;
}

// Devuelve el valor de similitud mediante la Distancia Euclidea entre dos usuarios
function distanciaEuclidea(u, v){
    let sum = 0;
    for(var i = 0; i < u.length; i++){
        if(u[i] != '-' && v[i] != '-')
            sum += Math.pow(u[i] - v[i],2);
    }
    let Euclidea = Math.sqrt(sum);
    return Euclidea;
}

// Devuelve la media conjunta de dos usuarios
function mediaConjunta(u, v){
    let counter = 0;
    let sumU = sumV = 0;

    for(var i = 0; i < u.length; i++){
        if(u[i] != '-' && v[i] != '-'){
            sumU += u[i];
            sumV += v[i];
            counter++;
        }
    }
    return [sumU/counter, sumV/counter];
}

// Ordena los vecinos mas próximos en similitud mediante la Distancia Euclidea
function ordenarVecinosEuclidea(matriz, u){
    // Objeto donde se almacena el indice del vecino y su correlacion de pearson con el usuario activo
    let vecinosProxEuclidea = [];
    for(var i = 0; i < matriz.length; i++){
        if(u != i) // Nos aseguramos que usuario != vecino
            vecinosProxEuclidea.push({"vecino": i, "sim": distanciaEuclidea(matriz[u],matriz[i])}); // Agregamos la tupla
    }
    // Ordenamos los vecinos por similitud
    let vecinosOrdenados = vecinosProxEuclidea.slice(0);
    vecinosOrdenados.sort(function(a,b) {
        return b.sim - a.sim; // Ordenamos de mayor a menor
    });
    return vecinosOrdenados;
}

// Devuelve la media de un usuario
function media(u){
    let sum = counter = 0;
    for(var i = 0; i < u.length; i++){
        if(u[i] != '-'){
            sum += u[i];
            counter++;
        }
    }
    return sum / counter;
}

// Esta función devuelve la matriz leída del fichero de texto
function crearMatriz(m){
    let fila = [];
    let matriz = [];

    for(var i = 0; i < m.length; i++){
        fila = []; // Reseteamos la fila

        for(var j = 0; j < m[i].split(' ').length; j++){

            // Verificamos si lo que se introduce es un numero o el guión
            if(isNaN(parseInt(m[i].split(' ')[j]))) fila.push('-');
            else fila.push(parseInt(m[i].split(' ')[j]));
        }
        matriz.push(fila);
    }
    return matriz;
}

