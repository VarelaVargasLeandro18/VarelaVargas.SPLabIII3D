const $ = (query) => document.querySelector(query);
let ultimoId = 1;
const tiempoSpinner = 1500;

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
    updateDeLocalStoragePorId
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
            console.log(id)
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
                    agregarMascotaATabla(mascota);
                    cargarAlLocalStorage(mascota, 'animales');
                    removerSpinner();
                    $('form').reset();
                    noMostrarAlert();
                    return
                }

                updateDeLocalStoragePorId(id, 'animales', mascota);
                eliminarPorId(id, $('tbody'));
                agregarMascotaATabla(mascota);
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
                
                eliminarPorId( id, $('tbody') );
                eliminarDeLocalStoragePorId(id, 'animales');
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

(function main() {
    let max = -1;
    let mascotas = cargarDeLocalStorage('animales');
    agregarVariosATabla(mascotas);

    if ( Array.isArray(mascotas) && mascotas.length > 0 ){
        
        mascotas.map( (value) => {
            if (value.id > max){
                max = value.id
                return true
            }
            return false
        } )[0].id;
    }
    ultimoId = ++max;

    asignarEventListeners();

})();