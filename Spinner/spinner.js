export function agregarSpinner ( { parentElement = null } ) {

    if ( !parentElement )
        parentElement = document.body;

    const fragmentSpinner = document.createDocumentFragment();

    const divContainer = document.createElement('div');
        divContainer.classList.add('spinner-container');
    
    const divSpinner = document.createElement('div');
        divSpinner.classList.add('loader');
    
    fragmentSpinner.appendChild(divSpinner);
    divContainer.appendChild(fragmentSpinner);
    
    parentElement.appendChild(divContainer);
}

export function removerSpinner () {

    const spinner = document.querySelector('.loader');
    const container = spinner.parentElement;

    container.remove();

}