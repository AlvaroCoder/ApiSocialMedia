const router = require('express').Router();
const queryPost = require('../MYSQL/queryPosts');
const queryAuthor = require('../MYSQL/queryAuthor');
const {sendMail, sendUniqueEmail} = require('../Services/emailer');
const { createPostEmail, getIDPostEmail,getPostEmailByTitle, createContentEmail, getPostsFromUser, getPostEmailBySubject, getContentEmailByIDPost} = require('../MYSQL/queryPostEmail');
const { getBodyEmail, getPostDetails} = require('../Services/PostClass').controladorPost;

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
function generateCode() {
    const base = 'abcdefghijklmopqrstuvxyzABCDEFGHIJKLMNOPQRSTUXYZ0123456789'
    let passwor = ''
    for (let index = 0; index < base.length; index++) {
        let num_random = Math.floor(Math.random()*base.length)
        passwor+=base.charAt(num_random);
    }
    return passwor
}
const controlador = {
    savePostEmail : async (req, res)=>{
        const body = req.body;
        const {idPost,oldTitle, title} = body;
        const idPostEmail = await getIDPostEmail(oldTitle); ;
        if (idPost == idPostEmail) {

            return;
        }
        await createPostEmail(body);                
        await createContentEmail(body);
        res.status(200).send(getPostDetails());
    },
    
    createContentEmail:async (req,res)=>{
        const subject = req.body.subject;
        const result = await getPostEmailBySubject(subject) || [];
        if (!result[0]) {
            const body = req.body;
            
        }        
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
        const result =await getPostsFromUser(nombre);
        res.send(result);
    },
    updatePostMail:(req,res)=>{
        
    }, 
    sendEmailCode : (req,res)=>{
        const {from,to, subject} = req.body;
        const obj_Pass_Email = generatePass2Emails(to, 12);
        to.forEach(elem=>{
            sendUniqueEmail(from, subject, elem, obj_Pass_Email[elem]);
        })
        res.send(obj_Pass_Email);
    },
    getPostEmailBySubject : async (req, res)=>{
        const {subjectEmail} = req.params;
        const subject = subjectEmail.split("&").join(" ");
        const idPost = await getIDPostEmail(subject);
        const postEmail = await getPostEmailBySubject(subject);
        const contentEmail = await getContentEmailByIDPost(idPost);
        let respond = postEmail[0]
        respond.contentEmail = contentEmail
        res.status(200).send(respond);
    }
}
router.get("/email/:subjectEmail", controlador.getPostEmailBySubject);
router.post("/email/savePostEmail", controlador.savePostEmail);
router.post("/email",controlador.getPostsEmail);
router.post("/email/createContentEmail",controlador.createContentEmail);
router.get("/email/contentCreate",controlador.contentCreate);
module.exports = router;