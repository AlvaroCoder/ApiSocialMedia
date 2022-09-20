const router = require('express').Router();
const queryAuthor = require("../MYSQL/queryAuthor");
const bcrypt = require('bcryptjs');

function Validar(data={}){
    var error = {}
    var { nombre, email, contrasenna } = data
    if ( email == '' || contrasenna == '' || nombre == '') {
        error.message = "Llene el formulario"
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        error.message = "Email inválido"
    }    
    return error;
}

var controlador = {
    userAdmin : {},
    signUp : async (req,res)=>{
        var {nombre , email, contrasenna } = req.body;
        //Validamos que la información no este vacía
        var respond = Validar(req.body);
        if (respond.message) {
            res.status(400).send(respond);
            return;
        }
        //Revisamos si existe algún usuario con el mismo correo
        var checkEmail = await queryAuthor.getAuthorByEmail(email) || [];
        if (checkEmail[0]) {
            res.status(401).json({
                error : {
                    message : 'El correo ya existe'
                }
            });
            return;
        }

        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                res.status(400).json({
                    error : {
                        message : err
                    }
                })
                throw err
            }
            bcrypt.hash(contrasenna, salt, async (err, hash)=>{
                if (err) {
                    throw err
                }
                
                var hash_contrasenna =  hash;
                var author = {nombre, email, contrasenna, hash_contrasenna}
                await queryAuthor.createAuthor(author)
                res.status(201).send(author);
            })
        });
        
    },
    login : async(req, res)=>{
        var { email, contrasenna }=req.body 
        //Validamos al author por nombre e email
        var respond = Validar(req.body);
        if (respond.message) {
            res.status(400).send(respond);
            return;
        }
        var author = await queryAuthor.getAuthorByEmail(email) || [];
        if (!author[0]) {
            var error = {
                message : 'No existe ese correo'
            }
            res.status(404).send(error)
            return;
        }
        var { contrasenn_hash } = author[0];
            bcrypt.compare(contrasenna, contrasenn_hash, function (err,result){
                if (err) {
                    res.sendStatus(404).send({
                        error : 'Falla en autenticación'
                    })
                    return;
                }
                var err_obj = {
                    message : 'Contraseña incorrecta'
                }
                if (!result) {
                    res.status(403).send(err_obj);
                    return;
                }
                controlador.userAdmin = author;
                res.status(201).send(author);
            });
    },
    mostrar : async (req,res)=>{
        var email = req.params.email
        var respond = await queryAuthor.getAuthorByEmail(email)
        res.send(respond)
    },
    actualizarBio : async (req,res)=> {
        var obj = req.body
        var respond = await queryAuthor.updateAuthor(obj)
        if (respond == 201) {
            res.send(`Autor :) ${obj.nombre} actualizado correctamente`)
        }       
    }
}

router.post("/signUp",controlador.signUp);
router.post("/login",controlador.login);
router.get("/show/:email",controlador.mostrar);
router.put("/updateAuthor",controlador.actualizarBio);

module.exports = router;