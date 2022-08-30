const router = require('express').Router();
const queryPost = require('../MYSQL/queryPosts');
const queryAuthor = require('../MYSQL/queryAuthor');
const {sendMail, sendUniqueEmail} = require('../Services/emailer');
const {getPostEmailsFromUser, createPostEmail, getIDPostEmail,getPostEmailByTitle, createContentEmail, getPostsFromUser} = require('../MYSQL/queryPostEmail');
const { setBodyEmail, getBodyEmail, getPostDetails} = require('../Services/PostClass').controladorPost;

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
        const title = req.body.title;
        const result = await getPostEmailByTitle(title) || [];
        result[0] ? res.send("Existe") : res.send("No existe")
    },
    contentCreate : (req,res)=>{
        getBodyEmail() ? res.send("Esta lleno") : res.send("Esta vacio")
    },
    sendPostMail : (req,res)=>{
        const {from, to, subject, htmlContent} = req.body;
        sendMail(from, subject,htmlContent ,to);
        res.status(200).send("Mensaje enviado");
    },
    getPostEmailDetail: async (req,res)=>{
        const {nombre} = req.body;
        const result = await getPostEmailsFromUser(nombre) || [];
        res.send(result);
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
    }
}
router.get("/email/getPostEmailDetail",controlador.getPostEmailDetail);
router.post("/email/savePostEmail", controlador.savePostEmail);
router.get("/email/getPosts",controlador.getPostsEmail);
router.post("/email/createContentEmail",controlador.createContentEmail);
router.get("/email/contentCreate",controlador.contentCreate);
module.exports = router;