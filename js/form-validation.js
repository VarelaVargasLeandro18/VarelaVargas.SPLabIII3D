const $ = (query) => document.querySelector(query);

export function validarForm ( formId ) {
    
    const form = $(formId);

    if ( !form ) return false;

    for (const input of form) {
        
        if ( 
            input.nodeName === 'INPUT' && input.required && input.value.length == 0 
            || 
            input.nodeName === 'OPTION' && !input.disabled ) return false;
    }

    return true;
}