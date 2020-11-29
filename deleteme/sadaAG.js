"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/AlgoritmoGeneticoHub").build();

document.getElementById("ejecutarAlgoritmo").disabled = true;

connection.on("EvolucionProgreso", function (datos) {
    var objeto = JSON.parse(datos);
    var texto = "Tiempo restante: " + objeto.MinutosRestantes + ":" + objeto.SegundosRestantes;
    document.getElementById(objeto.Procesador).innerText = texto;

    actualizarProgressBar(objeto.Procesador, objeto.PorcentajeCompletado);
});

function actualizarProgressBar(procesador, porcentaje) {
    $("#B" + procesador)
        .css("width", porcentaje + "%")
        .attr("aria-valuenow", porcentaje)
        .text(porcentaje + "% completado");
}

connection.on("EvolucionFin", function (solucion) {
    
    var objSolucion = JSON.parse(solucion);

    actualizarProgressBar(objSolucion.Procesador, 100);

    if (objSolucion.Imprecision === 0) 
        document.getElementById("T" + objSolucion.Procesador).appendChild(crearPresentacion(objSolucion));

});

connection.start().then(function () {
    document.getElementById("ejecutarAlgoritmo").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("ejecutarAlgoritmo").addEventListener("click", function (event) {
    connection.invoke("Ejecutar", 1, 1, 12).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

function crearPresentacion(objeto) {
    var presentacion = document.createElement("div");

    objeto.Dias.forEach(dia => {
        var titulo = document.createElement("h2");
        titulo.innerText = dia.Nombre;

        presentacion.appendChild(titulo);
        presentacion.appendChild(crearDia(dia));
    });

    return presentacion;
}

function crearDia(dia) {

    var tabla = document.createElement("table");
    tabla.className = "table table-responsive-sm";

    var cabecera = crearCabecera(dia);
    var cuerpo = crearCuerpo(dia);

    tabla.appendChild(cabecera);
    tabla.appendChild(cuerpo);

    console.log("Terminado: crearDia()");
    return tabla;
}

function crearCabecera(dia) {
    var cabecera = document.createElement("thead");
    var registro = document.createElement("tr");

    var celda = document.createElement("th");
    celda.scope = "col";
    celda.innerText = "Aula";
    registro.appendChild(celda);

    dia.Aulas[0].Horas.forEach(hora => {
        celda = document.createElement("th");
        celda.scope = "col";
        celda.innerText = hora.Orden + "hs";
        registro.appendChild(celda);
    });
    cabecera.appendChild(registro);

    console.log("Terminado: crearCabecera()");
    console.log(cabecera.innerHTML);
    return cabecera;
}

function crearCuerpo(dia) {
    var registros = document.createElement("tbody");
    dia.Aulas.forEach(aula => {

        var registro = document.createElement("tr");

        var celda = document.createElement("th");
        celda.innerText = aula.Codigo;
        celda.scope = "row";
        console.log("Celda:" + celda.innerHTML);
        registro.appendChild(celda);

        aula.Horas.forEach(hora => {
            celda = document.createElement("td");
            celda.innerText = hora.Comision + " " + hora.Asignatura;
            console.log("Celda:" + celda.innerHTML);
            registro.appendChild(celda);
        });
        registros.appendChild(registro);
    });

    console.log("Terminado: crearRegistros()");
    return registros;
}