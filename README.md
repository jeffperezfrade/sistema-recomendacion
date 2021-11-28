Descripción del código desarrollado:

Este código esta desarollado en JavaScript, junto con HTML y CSS se le da forma a la pantalla principal.
La parte más importante en esta ocasión se encuentra en JavaScript, donde se ha implementado un sistema de 
recomendacion utilizando usuarios similares al usuario estudiado.

El código se divide en varias funciones:
-> ejecutar(): Función principal la cual se ejecuta cuando le damos al botón de Ejecutar
-> leerArchivo(): Función para leer el archivo contenedor de la matriz de utilidad
-> mostrarContenido(): Muestra la matriz de utilidad leida del archivo anteriormente

Funciones que devuelven el valor de la similitud entre dos usuarios:
-> correlacionPearson()
-> distanciaCoseno()
-> distanciaEuclidea()

Funciones que devuelven el valor de la predicción dependiendo de la métrica y el tipo de predicción elegida:
-> prediccionPearson()
-> prediccionCoseno()
-> prediccionEuclidea()

Funciones que devuelven la lista de vecinos más próximos por similitud:
-> odenarVecinosPearson()
-> ordenarVecinosCoseno()
-> ordenarVecinosEuclidea()
--> Estas funciones devuelven un objeto ordenado por similitud, por ejemplo:
{
    "vecino": 3,
    "sim": 0.87
},
{
    "vecino": 2,
    "sim": 0.70
}


Funciones que devuelven la media:
-> media(): Devuelve la media de un usuario.
-> mediaConjunta(): Devuelve la media de ambos usuarios pero sin contar aquellas posiciones donde se encuentra el guión (ya sea de un    usuario o de otro).

Funcion para hacer la matriz de utilidad leida del fichero utilizable:
-> crearMatriz(): Devuelve la matriz estructurada en código JavaScript.

Función para imprimir la matriz resultante:
-> imprimirMatriz()




Ejemplo de Uso:

La pantalla principal cuenta con un botón donde se debe elegir el archivo de texto contenedor de la matriz de utilidad.
Una vez elegido el archivo se debe elegir una métrica y un tipo de predicción.
Por ultimo elegir el número de vecinos con los que se tiene que comparar a un usuario.

Al dar click en el botón de Ejecutar se desplegará debajo de este la matriz resultante con los 
resultados de las predicciones en sus respectivas posiciones.

Además debajo de la matriz resultante también se despliegan todos los pasos realizados para llegar a ese resultado.
Aparecen todos los vecinos estudiados y el Item el cual se ha calculado la predicción.