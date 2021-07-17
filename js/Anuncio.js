class Anuncio {
    constructor ( {
        id = -1,
        descripcion = "",
        transaccion = "ventas",
        precio = 0.0
    } ) 
    {
        this.id = id;
        this.descripcion = descripcion;
        this.transaccion = transaccion;
        this.precio = precio;
    };
}

export { Anuncio };