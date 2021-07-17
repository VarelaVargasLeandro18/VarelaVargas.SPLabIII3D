const $ = (query) => document.querySelector(query);
const $all = (query) => document.querySelectorAll(query);
let ultimoId = [];
const tiempoSpinner = 1500;

import { 
    removerSpinner, 
    agregarSpinner 
} from '../Spinner/spinner.js';

import {
    crearMascotaDeForm,
    agregarMascotaATabla,
    deTablaAForm,
    eliminarPorId,
    cargarAlLocalStorage,
    cargarDeLocalStorage,
    agregarVariosATabla,
    eliminarDeLocalStoragePorId,
    crearTablaDinamica,
    filtrarPorPropiedades,
    agregarPromedio,
    filtrarPorAnimal,
    postMascotaADB,
    getMascotasBD,
    deleteMascotaBD
} from './Anuncio_Mascota.js';

function asignarEventListeners() {

    document.body.addEventListener( 'click', (event) => {

        if (event.target.matches('button')) {
            event.preventDefault();
        }

        if ( event.target.matches('#guardar') ) {
            agregarSpinner({});
            setTimeout( () => {
                const mascota = crearMascotaDeForm({});
                mascota.id = ultimoId[0]++;
                //agregarMascotaATabla(mascota);
                postMascotas(mascota);
                removerSpinner();
            }, tiempoSpinner );
        }

        if ( event.target.matches("#eliminar") ) {
            agregarSpinner({});
            setTimeout( () => {
                const id = parseInt($('form').id.value);
                eliminarPorId( id, $('tbody') );
                //eliminarDeLocalStoragePorId(id, 'animales');
                deleteId(id);
                removerSpinner();
            }, tiempoSpinner );
        }

        if ( event.target.matches('td') ) {
            agregarSpinner({});
            setTimeout( () => {
                const tr = event.target.parentElement;
                deTablaAForm(tr, $('form'));
                removerSpinner();
            }, tiempoSpinner );
        }

        if ( event.target.matches('#cancelar') ) {
            const form = $('form');
            agregarSpinner({});
            setTimeout( () => {
                form.reset();
                removerSpinner();
            }, tiempoSpinner );
            
        }

    } );

    const filtrado = $("#filtrado");

    filtrado.addEventListener('click', (event) => {
        const valorFiltrado = filtrado.value;
        const checkboxes = $all("input[type=checkbox]");
        const columnas = [];
        
        checkboxes.forEach( (selected) => {
            if (selected.checked) 
                columnas.push(selected.value)
        } );
        
        let anunciosXAnimal = (valorFiltrado === "Todos") ? anuncios : filtrarPorAnimal( valorFiltrado, getAnuncios() );
        let anuncios = filtrarPorPropiedades(anunciosXAnimal, columnas);
        
        crearTablaDinamica(
            columnas,
            anuncios,
            $("#th-filtro"),
            $("#tb-filtro")
        );

        agregarPromedio($("#promedio"), anunciosXAnimal);
        
    })
    
}

function getAnuncios() {
    //return cargarDeLocalStorage('animales');
    let ret = getMascotasBD(ultimoId);
    return ret;
}

function postMascotas(mascota) {
    //cargarAlLocalStorage(mascota, 'animales');
    postMascotaADB(mascota);
}

function deleteId(id) {
    deleteMascotaBD(id);
}

(function main() {

    //let mascotas = getAnuncios();
    //console.log(mascotas);
    //agregarVariosATabla(mascotas);
    agregarSpinner({});
    getAnuncios();
    removerSpinner();

    /* if ( Array.isArray(mascotas) && mascotas.length > 0 )
        ultimoId = ++mascotas[ mascotas.length - 1 ].id; */

    asignarEventListeners();

})();