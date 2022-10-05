const router = require('express').Router();
const {sendMail, sendUniqueEmail} = require('../Services/emailer');
const { createEmptyPost, getPostsFromUser, getPostEmailBySubject} = require('../MYSQL/queryPostEmail');
const {getAuthorByName} = require('../MYSQL/queryAuthor');
const { getBodyEmail} = require('../Services/PostClass').controladorPost;

function generatePass2Emails(emails, longitud) {
    const base = "abcdefghijklmopqrstuvxyzABCDEFGHIJKLMNOPQRSTUXYZ0123456789{}¿+#@^$%&/(=)_!><"
    const objct = {}
    emails.forEach(element => {
        let password = ""
        for (let index = 0; index < longitud; index++) {
            let num_random = Math.floor(Math.random()*base.length);
            password+=base.charAt(num_random);
        }
        objct[element] = password
    });
    return objct;
}

const controlador = {
    createEmptyPostEmail:async (req,res)=>{
        const {nombre} = req.body;
        const existAuthor = await getAuthorByName(nombre);
        if (existAuthor[0]) {
            const result = await createEmptyPost(nombre);
            res.status(200).send(result);    
            return;
        }
        res.status(404).send("El usuario no existe");
    },
    contentCreate : (req,res)=>{
        getBodyEmail() ? res.send("Esta lleno") : res.send("Esta vacio")
    },
    sendPostMail : (req,res)=>{
        const {from, to, subject, htmlContent} = req.body;
        sendMail(from, subject,htmlContent ,to);
        res.status(200).send("Mensaje enviado");
    },
    getPostsEmail : async (req,res)=>{
        const {nombre} = req.body;
        const result = await getPostsFromUser(nombre);
        res.send(result);
    },
    sendEmailCode :  (req,res)=>{
        const {from,to, subject} = req.body;
        const obj_Pass_Email = generatePass2Emails(to, 12);
        to.forEach(elem=>{
            sendUniqueEmail(from, subject, elem, obj_Pass_Email[elem]);
        })
        res.send(obj_Pass_Email);
    },
    getPostEmailByIdentifierSubject : async (req, res)=>{
        const {identifier,subjectEmail} = req.params;
        const subject = subjectEmail;
        const postEmail = await getPostEmailBySubject(subject, identifier);
        res.status(200).send(postEmail);
    }
}
router.post("/email", controlador.getPostsEmail);
router.get("/email/:identifier/:subjectEmail", controlador.getPostEmailByIdentifierSubject)
router.post("/email/new",controlador.createEmptyPostEmail);

module.exports = router;