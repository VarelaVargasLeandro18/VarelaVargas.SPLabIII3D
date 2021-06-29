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
        vacuna = ""
    } ) {
        super( {id, descripcion, transaccion, precio} );
        this.animal = animal;
        this.titulo = titulo;
        this.raza = raza;
        this.fechaNac = fechaNac;
        this.vacuna = vacuna;
    }

}

function crearMascotaDeForm ({ form = $('form') }) {
    const id = form.id.value;
    const titulo = form.titulo.value;
    const descripcion = form.descripcion.value;
    const precio = form.precio.value;
    const animal = form.animal.value;
    const raza = form.raza.value;
    const fechaNac = form.fechaNac.value;
    const vacuna = form.vacuna.value;

    return new Anuncio_Mascota ( {
        id,
        titulo,
        descripcion,
        animal,
        transaccion : "ventas",
        precio,
        raza,
        fechaNac,
        vacuna
    } );
}

function cargarAForm ( {
    form = $('form'),
    mascota = null
} ) {

    if ( !form || !mascota ) return;

    form.id.value = mascota.id;
    form.titulo.value = mascota.titulo;
    form.descripcion.value = mascota.descripcion;
    form.precio.value = mascota.precio;
    form.animal.value = mascota.animal;
    form.raza.value = mascota.raza;
    form.fechaNac.value = mascota.fechaNac.value;
    form.vacuna.value = mascota.fechaNac.value;

}

function agregarMascotaATabla ( mascota ) {
    const fragmentForTr = document.createDocumentFragment();
    const tbody = document.querySelector("tbody");
    const tr = document.createElement('tr');
    const mascotaEntries = Object.entries(mascota);

    mascotaEntries.forEach ( ([key, value]) => {
        const td = document.createElement('td');
        
        if ( key !== 'id' ) td.innerText = value;
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


    if ( childrenTd === null ) return

    form.id.value = childrenTd[0].innerText; 
    form.titulo.value = childrenTd[1].innerText;
    form.descripcion.value = childrenTd[2].innerText;
    form.precio.value = childrenTd[3].innerText;
    form.animal.value = childrenTd[4].innerText;
    form.raza.value = childrenTd[5].innerText;
    form.fechaNac.value = childrenTd[6].innerText;
    form.vacuna.value = childrenTd[7].innerText;
}

function eliminarPorId ( id, tbody = document.createElement('') ) {

    const trs = tbody.childNodes;

    trs.forEach ( (elem) => {        
        if ( elem.nodeType === 1 ) {
            const tr_id = elem.getAttribute('mascota-id');

            if ( parseInt( tr_id ) === id ) {
                elem.remove();
                return
            }
        }

    });

}

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
                vacuna
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
    const nuevosAnuncios = arrAnuncios.filter( (value) => {
        return value.id != Id;
    } );
    localStorage.setItem(localName, JSON.stringify(nuevosAnuncios));
}
/* #endregion */

function filtrarPorTransaccion (transaccion, anuncios, pasaSiOSi) {

    const filtrados = anuncios.filter( (value) => transaccion === pasaSiOSi || value.transaccion === transaccion );
    return filtrados;
}

function filtrarPorAnimal (animal, anuncios, pasaSiOSi) {

    const filtrados = anuncios.filter( (value) => animal === pasaSiOSi || value.animal === animal );
    return filtrados;
}

function crearTablaDinamica (headElem, anuncios, DOMThead, DOMTbody) {

    vaciarElementos(DOMThead);
    vaciarElementos(DOMTbody);

    const trhead = document.createElement("tr");
    const fragmentHead = document.createDocumentFragment();

    for ( const thValue of headElem ) {
        const th = document.createElement("th");
        th.innerText = thValue;
        fragmentHead.appendChild(th);
    }
    trhead.appendChild(fragmentHead);
    DOMThead.appendChild(trhead);
    
    const trsBody = document.createDocumentFragment();

    for ( const anuncio of anuncios ) {
        const tr = document.createElement("tr");
        const trFragment = document.createDocumentFragment();
        for (const elem of Object.values(anuncio)) {
            const td = document.createElement("td");
            td.innerText = elem;
            trFragment.appendChild(td);
        }
        tr.appendChild(trFragment);
        trsBody.appendChild(tr);
    }

    DOMTbody.appendChild(trsBody);
}

function filtrarPorPropiedades (anuncios, propiedades) {
    
    return anuncios.map( (value) => {
        const nuevoObj = {};
        
        for (const propiedad of propiedades) {
            nuevoObj[propiedad] = value[propiedad];
        }

        return nuevoObj;
    } );

}

function agregarPromedio(DOMPrecios, anuncios) {
    const precios = anuncios.map( (value) => parseFloat(value.precio) );
    const sumaPrecios = precios.reduce( (acum, current) => acum += parseFloat(current) );
    const cantPrecios = precios.length;
    
    DOMPrecios.value = (sumaPrecios/cantPrecios);
}

function vaciarElementos (DOMElement) {
    while (DOMElement.firstChild) {
        DOMElement.removeChild(DOMElement.lastChild);
    }
}

function postMascotaADB (mascota) {

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = (event) => {
        const state = xhr.readyState;

        if ( state === XMLHttpRequest.DONE ) {
            if ( xhr.status >= 200 && xhr.status < 299 || xhr.status === 304 ) {
                agregarVariosATabla( JSON.parse(xhr.responseText) );
            }
        }

    }

    xhr.open( 'POST', 'http://localhost:5000/Animales', true );

    // Setteamos cabeceras
    xhr.setRequestHeader( 'Content-Type', "application/json;charset=utf-8" );
    
    //Enviamos petición
    xhr.send(JSON.stringify( mascota ));
    
}

async function getMascotasBD (ultimoId) {
    
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = (event) => {
        const state = xhr.readyState;

        if ( state === XMLHttpRequest.DONE ) {
            if ( xhr.status >= 200 && xhr.status < 299 || xhr.status === 304 ) {
                const mascotas = JSON.parse(xhr.responseText);
                agregarVariosATabla( mascotas );
                ultimoId[0] = ++mascotas[ mascotas.length - 1 ].id;
            }
        }

    }

    xhr.open( 'GET', 'http://localhost:5000/Animales', true );
    xhr.send();

}

/* fetch ( 'http://localhost:5000/Animales' )
    .then( (response) => { return response.ok? response.json() : Promise.reject( response ) } )
    .then( (animales) => agregarVariosATabla(animales) )
    .catch( (error) => { console.error(error) } ); */

function deleteMascotaBD (id) {
    fetch ( 'http://localhost:5000/Animales/' + id, {method: 'DELETE'})
        .then( (response) => { return response.ok? response.json() : Promise.reject( response ) } )
        .then( (animales) => { agregarVariosATabla(animales) } )
        .catch( (error) => { console.error(error) } );
}

function putMascotaBD (id) {
    fetch ( 'http://localhost:5000/Animales/' + id, {method: 'PUT'} )
    .then( (response) => { return response.ok? response.json() : Promise.reject( response ) } )
    .then( (animales) => { agregarVariosATabla(animales) } )
    .catch( (error) => { console.error(error) } );
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
        filtrarPorTransaccion,
        crearTablaDinamica,
        filtrarPorPropiedades,
        agregarPromedio,
        filtrarPorAnimal,
        postMascotaADB,
        getMascotasBD,
        deleteMascotaBD
};