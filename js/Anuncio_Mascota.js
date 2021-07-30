import { Anuncio } from './Anuncio.js';

const $ = (query) => document.querySelector(query);

class Anuncio_Mascota extends Anuncio {
    
    constructor ( {
        id = -1,
        titulo = "",
        descripcion = "",
        animal = "",
        transaccion = "ventas",
        precio = 0.0,
        raza = "",
        fechaNac = "",
        vacuna = "",
        pelaje = []
    } ) {
        super( {id, descripcion, transaccion, precio} );
        this.animal = animal
        this.titulo = titulo;
        this.raza = raza;
        this.fechaNac = fechaNac;
        this.vacuna = vacuna;
        this.pelaje = pelaje;
    }

}

/* #region GUI funcionts */
function crearMascotaDeForm ({ form = $('form') }) {
    const id = parseInt(form.id.value);
    const titulo = form.titulo.value;
    const descripcion = form.descripcion.value;
    const precio = form.precio.value;
    const animal = form.animal.value;
    const raza = form.raza.value;
    const fechaNac = form.fechaNac.value;
    const vacuna = form.vacuna.value;
    const pelaje = [];
    
    for ( const checkbox of form.pelaje ) {
        if ( checkbox.checked ) {
            pelaje.push(checkbox.value);
        }
    }

    return new Anuncio_Mascota ( {
        id,
        titulo,
        descripcion,
        animal,
        transaccion : "ventas",
        precio,
        raza,
        fechaNac,
        vacuna,
        pelaje
    } );
}

function agregarMascotaATabla ( mascota ) {
    const fragmentForTr = document.createDocumentFragment();
    const tbody = document.querySelector("tbody");
    const tr = document.createElement('tr');
    const mascotaEntries = Object.entries(mascota);

    mascotaEntries.forEach ( ([key, value]) => {
        const td = document.createElement('td');
        
        if ( key === 'pelaje' ) {
            td.innerText = JSON.stringify(value);
        }
        else if ( key !== 'id' ) td.innerText = value;
        else {
            td.innerText = value;
            tr.setAttribute( 'mascota-id', value );
        }    
        
        fragmentForTr.appendChild(td);
    } );

    tr.appendChild(fragmentForTr);
    tbody.appendChild(tr);
}

function deTablaAForm ( tr, form ) {
    const childrenTd = tr.children;
    const formPelaje = form.pelaje;
    const arrayPelaje = JSON.parse(childrenTd[9].innerText);
    
    if ( childrenTd === null ) return

    form.id.value = parseInt(childrenTd[0].innerText); 
    form.descripcion.value = childrenTd[1].innerText;
    form.precio.value = childrenTd[3].innerText;
    form.animal.value = childrenTd[4].innerText;
    form.titulo.value = childrenTd[5].innerText;
    form.raza.value = childrenTd[6].innerText;
    form.fechaNac.value = childrenTd[7].innerText;
    form.vacuna.value = childrenTd[8].innerText;
    
    for ( const color of arrayPelaje ) {
        
        for ( const checkbox of formPelaje ) {

            if ( color === checkbox.value ) {
                checkbox.checked = true;
                break;
            }

        }

    }
    
}

function eliminarPorId ( id, tbody = document.createElement('tbody') ) {

    const trs = tbody.childNodes;

    trs.forEach ( (elem) => {        
        if ( elem.nodeType === Node.ELEMENT_NODE ) {
            const tr_id = parseInt(elem.getAttribute('mascota-id'));
            
            if ( parseInt( tr_id ) == id ) {
                elem.remove();
                return
            }
        }

    });

}
/* #endregion */

/* #region Local Storage */
function cargarAlLocalStorage( anuncio, localName ) {
    const arrAnuncios = cargarDeLocalStorage(localName);
    arrAnuncios.push(anuncio);
    localStorage.setItem( localName, JSON.stringify(arrAnuncios) );

    return true;
}

function cargarDeLocalStorage(localName) {
    const jsonAnuncios = localStorage.getItem( localName );
    
    if ( !jsonAnuncios || jsonAnuncios.length == 0 ) return [];
    
    const jsonArr = JSON.parse(jsonAnuncios);
    let arrAnuncios = [];

    jsonArr.forEach ( elem => {
        const id = elem.id;
        const titulo = elem.titulo;
        const descripcion = elem.descripcion;
        const animal = elem.animal;
        const transaccion = elem.transaccion;
        const precio = elem.precio;
        const raza = elem.raza;
        const fechaNac = elem.fechaNac;
        const vacuna = elem.vacuna;
        const pelaje = elem.pelaje

        arrAnuncios.push ( 
            new Anuncio_Mascota ( {
                id,
                titulo, 
                descripcion, 
                animal, 
                transaccion, 
                precio, 
                raza, 
                fechaNac, 
                vacuna,
                pelaje
            })
        );
    } );

    return arrAnuncios;
}

function agregarVariosATabla (anuncios) {
    const contenedor = document.querySelector('tbody');
    
    while ( contenedor.hasChildNodes() ) {
        contenedor.removeChild(contenedor.firstChild);
    }

    anuncios.forEach ( elem => {
        agregarMascotaATabla(elem);
    } );
}

function eliminarDeLocalStoragePorId (Id, localName) {
    const arrAnuncios = cargarDeLocalStorage(localName);
    const nuevosAnuncios = arrAnuncios.filter( (value) => value.id != Id );
    localStorage.setItem(localName, JSON.stringify(nuevosAnuncios));
}

function updateDeLocalStoragePorId ( Id, localName, anuncio ) {
    eliminarDeLocalStoragePorId(Id, localName);
    cargarAlLocalStorage(anuncio, localName);
}
/* #endregion */

/* #region CRUD functions */
async function leerTodasDeBD(url) {

    try {

        const response = await fetch( url );
        const json = await response.json();

        if ( json === null )
            throw new Error("No se pudo obtener la data.");

        return json;
    }
    catch ( error ) {
        throw error; 
        // Realizo un throw ya que sin leer los objetos de BD no se puede seguir
    }

}

function postBD ( mascota, url ) {

    try {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            const state = xhr.readyState;
            const httpStatus = xhr.status;
            
            if ( state === XMLHttpRequest.DONE &&
                httpStatus >= 200 && httpStatus < 300 ) {
                    console.log( 'POST Realizado correctamente.' );
                }

        }
        xhr.open( 'POST', url, false );
        xhr.setRequestHeader( 'Content-Type', 'application/json; charset=utf-8' );
        xhr.send( JSON.stringify(mascota) );
    } catch (error) {
        console.error(error);
    }
    
}

function updateBD ( mascota, url ) {

    try {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            const state = xhr.readyState;
            const httpStatus = xhr.status;
            
            if ( state === XMLHttpRequest.DONE &&
                httpStatus >= 200 && httpStatus < 300 ) {
                    console.log( 'PUT Realizado correctamente.' );
                }

        }
        xhr.open( 'PUT', url + `/${mascota.id}/`, false );
        xhr.setRequestHeader( 'Content-Type', 'application/json; charset=utf-8' );
        xhr.send( JSON.stringify(mascota) );
    } catch (error) {
        console.error(error);
    }

}

function deleteBD ( id, url ) {
    
    const headers = new Headers();
    const method = 'DELETE';
    headers.append( 'Content-Type', 'application/json; charset=utf-8' );
    fetch( url + `/${id}/`, { headers, method } )
    .then( (response) => response?.ok ? response.json() : Promise.reject(response) )
    .then( (jsonResponse) => console.log(jsonResponse) )
    .catch( (error) => console.error(error) );

}
/* #endregion */

function obtenerPromedioPrecio ( mascotas ) {
    
    if ( !Array.isArray(mascotas) || mascotas.length <= 0 ) return 0;
    
    let prom = mascotas.map( (value) => parseFloat(value.precio) )
                .reduce( (accum, current) => accum + current );
    prom /= mascotas.length;
    return Math.round ( prom * 100 ) / 100;
}

function filtrarPorRaza ( mascotas, raza = "Todos" ) {
    if ( raza === "Todos" ) return mascotas;

    return mascotas.filter( (value) => value.animal.toLowerCase() === raza.toLowerCase() );
}

function filtrarPropiedades ( mascotas, props ) {

    const ret = mascotas.map( (value) => {

        const keys = Object.keys( value );
        let newValue = {};

        for (const key of keys) {
            if ( props.includes(key) || key === "id" ) {
                newValue[key] = value[key];
            };
        }

        return newValue;
    } )

    return ret;
}

export { 
        Anuncio_Mascota, 
        crearMascotaDeForm, 
        agregarMascotaATabla, 
        deTablaAForm, 
        eliminarPorId, 
        cargarAlLocalStorage,
        cargarDeLocalStorage,
        agregarVariosATabla,
        eliminarDeLocalStoragePorId,
        updateDeLocalStoragePorId,
        leerTodasDeBD,
        postBD,
        updateBD,
        deleteBD,
        obtenerPromedioPrecio,
        filtrarPorRaza,
        filtrarPropiedades
};