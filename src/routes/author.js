const router = require('express').Router()
const queryAuthor = require("../MYSQL/queryAuthor")
var controlador = {
    crear : async (req,res)=>{
        var obj = req.body;
        var nombre = obj.nombre;
        var checkauthor = await queryAuthor.getAuthor(nombre)
        if (checkauthor) {
            res.send("El usuario ya existe")
        }else{
            var respond = await queryAuthor.createAuthor(obj)
            if (respond == 201) {
                res.send("Usuario correctamente creado")
            }
        }
    },
    mostrar : async (req,res)=>{
        var nombre = req.params.nombre
        var respond = await queryAuthor.getAuthor(nombre)
        res.send(respond)
    },
    actualizarBio : async (req,res)=> {
        var obj = req.body
        var respond = await queryAuthor.updateAuthor(obj)
        if (respond == 201) {
            res.send(`Autor ${obj.nombre} actualizado correctamente`)
        }       
    },
    crearPost : async (req,res)=>{
        
    }
}

router.post("/create",controlador.crear)
router.get("/get/:nombre",controlador.mostrar)
router.put("/update",controlador.actualizarBio)
module.exports = router