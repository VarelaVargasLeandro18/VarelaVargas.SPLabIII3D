const $ = (query) => document.querySelector(query);
const $all = (query) => document.querySelectorAll(query);
let ultimoId = 1;
const tiempoSpinner = 1;
const url = 'http://localhost:5000/Animales';

import { 
    removerSpinner, 
    agregarSpinner 
} from '../css/Spinner/spinner.js';

import {
    crearMascotaDeForm,
    agregarMascotaATabla,
    deTablaAForm,
    eliminarPorId,
    cargarAlLocalStorage,
    cargarDeLocalStorage,
    agregarVariosATabla,
    eliminarDeLocalStoragePorId,
    updateDeLocalStoragePorId,
    Anuncio_Mascota,
    leerTodasDeBD,
    postBD,
    updateBD,
    deleteBD,
    obtenerPromedioPrecio,
    filtrarPorRaza,
    filtrarPropiedades
} from './Anuncio_Mascota.js';

import {
    validarForm
} from './form-validation.js';

function asignarEventListeners() {

    document.body.addEventListener( 'click', (event) => {

        if (event.target.matches('button')) {
            event.preventDefault();

            if (event.target.matches("#guardar")
                && !validarForm('form') ) {
                window.alert('Faltan CAMPOS!');
                return
            }
        }

        if ( event.target.matches('#guardar') ) {

            const id = parseInt($('form').id.value);
            if ( id <= 0 ) {
                mostrarAlert('Guardando...');
            }
            else {
                mostrarAlert('Updateando...');
            }

            agregarSpinner({});
            setTimeout( () => {
                const mascota = crearMascotaDeForm({});
                
                if ( id <= 0 ) {
                    mascota.id = ultimoId++;
                    agregarMascota( mascota, 'animales' );
                    removerSpinner();
                    $('form').reset();
                    noMostrarAlert();
                    return
                }

                updateMascota(mascota);
                removerSpinner();
                $('form').reset();
                noMostrarAlert();
            }, tiempoSpinner );
            
        }

        if ( event.target.matches("#eliminar") ) {
            mostrarAlert('Eliminando...');
            agregarSpinner({});
            setTimeout( () => {
                const id = parseInt($('form').id.value);
                
                if ( id === 0 ) {
                    window.alert('NO SE SELECCIONÓ NADA');
                    removerSpinner();
                    noMostrarAlert();
                    return
                }
                
                deleteMascota( id );
                removerSpinner();
                noMostrarAlert();
            }, tiempoSpinner );
        }

        if ( event.target.matches('#main-tbody>tr>td') ) {     
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

        if ( event.target.matches('#tipo') ||
            event.target.matches("input[type='checkbox']") ) {
            realizarFiltrado();
        }

    } );

}

function mostrarAlert ( texto ) {
    const divAlert = $('#custom-alert');
    vaciarNodo(divAlert);
    const textNode = document.createTextNode(texto);
    divAlert.appendChild(textNode);
    divAlert.classList.add('display-flex');
}

function noMostrarAlert () {
    const divAlert = $('#custom-alert');
    divAlert.classList.remove('display-flex');
}

function vaciarNodo ( nodo = document.createElement('') ) {
    nodo.innerText = '';
}

/* #region CRUD Functions */
/**
 * Agrega una mascota a BBDD, a LocalStorage y a tabla.
 * @param {Anuncio_Mascota} mascota - La mascota a agregar. 
 * @param {string} nombreLocal - Nombre de la local Storage
 */
function agregarMascota( mascota, nombreLocal ) {
    agregarMascotaATabla(mascota);
    postBD(mascota, url);
    cargarAlLocalStorage(mascota, nombreLocal);
}

/**
 * Elimina una mascota de BBDD y tabla.
 * @param {number} id - Id de la mascota a eliminar. 
 */
function deleteMascota( id ) {
    deleteBD(id, url);
    eliminarPorId( id, $('tbody') );
    eliminarDeLocalStoragePorId( id, 'animales' );
}

/**
 * Actualiza una mascota en BBDD y en Tabla.
 * @param {Anuncio_Mascota} mascota - La mascota a updattear 
 */
function updateMascota( mascota ) {
    const id = mascota.id;
    updateDeLocalStoragePorId(id, 'animales', mascota);
    updateBD(mascota, url);
    eliminarPorId(id, $('#main-tbody'));
    agregarMascotaATabla(mascota);
}

/**
 * Obtiene las mascotas de BBDD y las agrega a la tabla.
 */
async function getMascotas() {
    let max = -1;
    /* let mascotas = cargarDeLocalStorage('animales'); */
    let mascotas = await leerTodasDeBD(url);
    agregarVariosATabla(mascotas);
    localStorage.setItem('animales', JSON.stringify(mascotas));

    if ( Array.isArray(mascotas) && mascotas.length > 0 ){
        
        mascotas.forEach( (value) => {
            if (value.id > max){
                max = value.id
            }
        } );
    }

    ultimoId = ++max;
    return mascotas;
}
/* #endregion */

function obtenerTipo () {
    return $("select[name='tipo']").value;
}

function obtenerPropiedadesAMostrar () {

    const propsChecks = $all("input[name='check-prop']");
    let props = [];

    propsChecks.forEach ( (check) => {
        
        if ( check.checked ) props.push( check.value );
    
    } );

    return props;
}

function crearTablaDePropiedadesMascota ( animales, tbody = $("#tb-filtro"), thead = $("#th-filtro") ) {

    if ( !Array.isArray(animales) && !animales.length ) return

    const ths = document.createDocumentFragment();
    const props = Object.keys(animales[0]);

    props.forEach( (value) => {
        const th = document.createElement('th');
        const thText = document.createTextNode(value);
        th.appendChild( thText );
        ths.appendChild(th);
    } );

    const trs = document.createDocumentFragment();
    animales.forEach( (animal) => {
        const tr = document.createElement('tr');
        const keys = Object.keys(animal);

        keys.forEach( (key) => {
            const td = document.createElement('td');
            const tdText = document.createTextNode( animal[key] );
            td.appendChild(tdText);
            tr.appendChild(td);
        } )

        trs.appendChild(tr);
    } );

    vaciarNodo(thead);
    vaciarNodo(tbody);

    thead.appendChild(ths);
    tbody.appendChild(trs);
}

function settearPromedio (mascotas) {
    $('#promedio').value = obtenerPromedioPrecio(mascotas);
}

async function realizarFiltrado ( animales = cargarDeLocalStorage('animales') ) {
    const raza = obtenerTipo();
    const props = obtenerPropiedadesAMostrar();
    settearPromedio(animales);
    
    animales = filtrarPorRaza( animales, raza );
    animales = filtrarPropiedades( animales, props );

    crearTablaDePropiedadesMascota( animales );
}

(async function main() {
    console.warn("USANDO LIVE-SERVER SE ACTUALIZA CADA VEZ QUE UN ARCHIVO DEL DIRECTORIO SE ACTUALIZA. (en este caso animales.json");
    
    try {
        agregarSpinner({});
        const mascotas = await getMascotas();
        realizarFiltrado(mascotas);
    } catch( error ) {
        console.error(error);
        realizarFiltrado();
    }

    removerSpinner();

    asignarEventListeners();

})();