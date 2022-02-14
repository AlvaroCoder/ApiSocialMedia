const router = require("express").Router()
const {crearArticulo, crearContenido, mostrarArticulo} = require("../MYSQL/queryArticulo")

const controlador = {
    crear : async(req,res)=>{
        /*
        const articulo = {
            author : 'Alvaro Pupuche',
            titulo : 'Listas enlazadas',
            nombre : 'listas enlazadas',
            img_articulo : '../Imagenes/FondoListasEnlazadas.png',
            categoria : 'Estructura de datos'
        }

        var respondArticulo = await crearArticulo(articulo)
        console.log(respondArticulo);
        res.send("Articulos creado")*/
        const contenido = [
            {idArticulo :1,tipo: 'p',contenido:'En otro archivo llamado ListaProductos.java crearemos el resto de la lista enlazada. ', link : ''},
            {idArticulo :1,tipo: 'p',contenido:'Esta clase tendrá 2 atributos, uno de tipo Producto llamado cabeza y otro de tipo entero llamado “tamanno”, el cual nos permitirá saber cuántos productos estamos agregando ', link : ''},
            {idArticulo :1,tipo: 'p',contenido:'Dentro de esta clase, crearemos algunas funciones básicas, como “insertarProducto”, “añadirProducto”, “mostrarProductos”. Además de crear el método main. ', link : ''},
            {idArticulo :1,tipo: 'nota',contenido:'La diferencia entre añadirProducto e insertarProducto, es el orden en el cual guardamos la información. Es decir, cuando añadimos un producto, lo estamos agregando al final, pero cuando insertamos uno lo estamos agregando al inicio. \n Pero cuando lo imprimimos, el primer elemento que vemos es el último agregado. ', link : ''},
            {idArticulo :1,tipo: 'h2',contenido:'Ejemplo de Lista enlazada', link : ''},
            {idArticulo :1,tipo: 'h3',contenido:'Atributos de la clase', link : ''}
        
        ]
        contenido.forEach(async (value)=>{
            var objct = {idArticulo : value.idArticulo, tipo : value.tipo, contenido: value.contenido, link : value.link}
            var respondContent = await crearContenido(objct)
            console.log(respondContent);

        })
        res.send("Contenidos creados")
    },
    mostrar : async (req,res)=>{
        var articulo = await mostrarArticulo(1)

        res.type(".json")
        res.send(articulo)

    }
}

router.get("/mostrar",controlador.mostrar)
router.get("/crear_new_articulo",controlador.crear)

module.exports = router