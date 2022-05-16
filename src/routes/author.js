const router = require('express').Router();
const queryAuthor = require("../MYSQL/queryAuthor");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_KEY || 'sshhh'

var controlador = {
    signUp : async (req,res)=>{
        var {nombre , email, contrasenna } = req.body;
        //Validamos que la información no este vacía
        if (nombre == '' || email  == '' || contrasenna == '') {
            res.status(400).send({
                error : 'Llene el formulario'
            })
            return;
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({
                error : 'Email inválido'
            });
            return;
        }
        //Revisamos si existe algún usuario con el mismo correo
        var checkEmail = await queryAuthor.getAuthorByEmail(email) || [];
        if (checkEmail[0]) {
            res.status(401).json({
                error: 'El correo ya existe'
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
                // Partes de un token
                //Header
                //Payload
                //Signature
                console.log(secretKey);
                const token = jwt.sign(
                    { nombre, email, contrasenna},
                    secretKey,
                    {
                        expiresIn : '7d'
                    }
                )
                
                var userToken = token;
                var hash_contrasenna =  hash;
                var author = {nombre, email, contrasenna, hash_contrasenna, userToken}
                var respond = await queryAuthor.createAuthor(author)
                res.status(201).json(author)
            })
        });
        
    },
    login : async(req, res)=>{
        var { email, contrasenna }=req.body 
        //Validamos al author por nombre e email
        var author = await queryAuthor.getAuthorByEmail(email) || [];
        
        if (author[0]) {
            var { contrasenn_hash } = author[0];
            bcrypt.compare(contrasenna, contrasenn_hash, function (err,result){
                if (err) {
                    res.sendStatus(404).send({
                        error : 'Falla en autenticación'
                    })
                }
                var err_obj = {
                    message : 'Contraseña incorrecta'
                }
                result ? res.status(201).send(author) : res.status(403).send(err_obj)
            });
        }else{
            var error = {
                message : 'No existe ese correo'
            }
            res.status(404).send(error)
        }
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
            res.send(`Autor ${obj.nombre} actualizado correctamente`)
        }       
    },
    crearPost : async (req,res)=>{
        //Crearemos un post sencillo
        //Con titulo, una descripción e imagen
        var {titulo, img, descripcion} = req.body
        
    }
}

router.post("/signUp",controlador.signUp);
router.post("/login",controlador.login);

//Middleware para verificar el token
//Recordar que mientras el cliente este navegando, siempre enviamos el token para verificación.
router.use((req,res,next)=>{
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        res.status(400).send({
            error : 'Es necesario un token para la autenticación'
        })
        return;
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    jwt.verify(token, secretKey,(err,decode)=>{
        if (err) {
            res.send({
                error : 'El token no es válido'
            })
        }else{
            req.decoded = decode
            next();
        }
    })
});

router.get("/show/:email",controlador.mostrar);
router.post("/createPost",controlador.crearPost);
router.put("/updateAuthor",controlador.actualizarBio);
module.exports = router;