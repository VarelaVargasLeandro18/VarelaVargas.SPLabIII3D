const $ = (query) => document.querySelector(query);
let ultimoId = 1;
const tiempoSpinner = 1;

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
    Anuncio_Mascota
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
    cargarAlLocalStorage(mascota, nombreLocal);
}

/**
 * Elimina una mascota de BBDD y tabla.
 * @param {number} id - Id de la mascota a eliminar. 
 */
function deleteMascota( id ) {
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
    eliminarPorId(id, $('#main-tbody'));
    agregarMascotaATabla(mascota);
}

/**
 * Obtiene las mascotas de BBDD y las agrega a la tabla.
 */
function getMascotas() {
    let max = -1;
    let mascotas = cargarDeLocalStorage('animales');
    agregarVariosATabla(mascotas);

    if ( Array.isArray(mascotas) && mascotas.length > 0 ){
        
        mascotas.forEach( (value) => {
            if (value.id > max){
                max = value.id
            }
        } );
    }

    ultimoId = ++max;
}
/* #endregion */

(function main() {
    getMascotas();
    asignarEventListeners();
})();