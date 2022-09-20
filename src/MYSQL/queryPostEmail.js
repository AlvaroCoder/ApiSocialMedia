const mysql2 = require('mysql2/promise');
const {keys} = require('../Keys/KeyMysql');
const poolRoute = process.env.DATABASE_URL || keys
const pool = mysql2.createPool(poolRoute);
const {setBodyEmail, setBodyContentEmail, getElementsBodyEmail} = require('../Services/PostClass').controladorPost;

const GET_POSTDETAILS_FROM_USER = "SELECT postemail.title, postemail.fechaCreacion, postemail.link, postemail.estado FROM author INNER JOIN postemail ON author.idauthor = postemail.idAuthor WHERE author.nombre = ?;"
const GET_POSTS_FROM_USER = "SELECT author.nombre, postemail.idPost, postemail.fechaCreacion, postemail.link, postemail.fromUser, postemail.toUser, postemail.subjectEmail, postemail.time2send, postemail.estado FROM author INNER JOIN postemail ON author.idauthor = postemail.idAuthor WHERE author.nombre =  ?;"
const GET_CONTENT_FROM_IDPOST = " SELECT * FROM postemail INNER JOIN contentEmail ON postemail.idPost = contentemail.idPost WHERE contentEmail.idPost = ?;"
const GET_CONTENT_BY_IDPOST= " SELECT tipocontent.sigla, contentemail.content, contentemail.src, contentemail.alt, contentemail.link from contentemail inner join tipocontent on contentemail.idTipo = tipocontent.idTipo where contentemail.idPost = ?;";
const GET_TIPOCONTENT_BY_ID = "SELECT sigla FROM tipocontent WHERE idTipo = ?;"
const GET_IDAUTHOR_NAME = "SELECT idauthor FROM author WHERE nombre = ?;";
const GET_IDPOST_EMAIL = "SELECT idPost FROM postemail WHERE subjectEmail = ?;";
const GET_POSTEMAIL_BY_TITLE = "SELECT * FROM postemail WHERE title = ?;";
const GET_POSTEMAIL_BY_SUBJECT = "SELECT * FROM postemail WHERE subjectEmail =  ?;"

const CREATE_POST_EMAIL = "INSERT INTO postemail (idAuthor, fechaCreacion, title, link, fromUser, toUser, subjectEmail, time2Send, estado) VALUES (?,?,?,?,?,?,?,?,?);";
const INSERT_VALUES_CONTENTEMAIL = "INSERT INTO contentEmail (idPost, content, tipoDe) VALUES (?, ?, ?);"
const UPDATE_CONTENT_EMAIL = "UPDATE contentEmail SET content = ? WHERE idPost = ?;"

const getPostDetailsFromUser=async nombre=>{
    const field = await pool.query(GET_POSTDETAILS_FROM_USER, [nombre]).then(([rows, fields])=>{
        return rows
    });
    return field;
}
const getContentEmailByIDPost = async idPost=>{
    const contentEmail = await pool.query(GET_CONTENT_BY_IDPOST,[idPost]).then((val)=>{
        return val[0]
    });
    return contentEmail;
}
const getPostsFromUser = async nombre =>{
    const postDetails = await pool.query(GET_POSTS_FROM_USER, [nombre]).then((val)=>{
        return val[0]
    });
    for(let key in postDetails){
        const content = await getContentEmailByIDPost(postDetails[key].idPost) || [];
        postDetails[key].contentEmail = content;
    }
    return postDetails;
}
const getPostEmailByTitle = async title=>{
    return await pool.query(GET_POSTEMAIL_BY_TITLE, [title]).then(([rows,field])=>{
        return rows;
    });
}
const getPostEmailBySubject = async subject =>{
    return await pool.query(GET_POSTEMAIL_BY_SUBJECT, [subject]).then(([rows, field])=>{
        return rows;
    });
}
const getIDAuthorByName = async nombre=>{
    const field = await pool.query(GET_IDAUTHOR_NAME,[nombre]).then(([rows,fields])=>{
        return rows
    });
    return field[0] ? field[0].idauthor : null;
}
const createPostEmail = async objct=>{
    const {nombre, title, fromUser, toUser, subject, time2send}=objct;
    const idAuthor = await getIDAuthorByName(nombre);
    const date = new Date().toLocaleDateString();
    const link = "http://localhost:3000/"
    const idPost = await pool.execute(CREATE_POST_EMAIL,[idAuthor, date, title, link, fromUser, toUser, subject, time2send, 'NE']).then((val)=>{
        return val[0].insertId;
    });
    const body = {nombre, idPost, idAuthor, title, fromUser, subject, time2send, date, link}
    
    //Modificar
    if (!getElementsBodyEmail()) {
        const posts = await getPostsFromUser(nombre);
        setBodyEmail(posts);
    }    
}
const getIDPostEmail=async title=>{
    const field = await pool.query(GET_IDPOST_EMAIL,[title]).then(([rows,fields])=>{
        return rows
    });
    return field[0] ? field[0].idPost : null;
}
const createContentEmail = async objct=>{
    const {title,contentEmail} = objct;
    const idPost = await getIDPostEmail(title);
    contentEmail.forEach(async (element, index)=>{
        const {content, tipoDe} = element;
        const idContent = await pool.execute(INSERT_VALUES_CONTENTEMAIL, [idPost, content, tipoDe]).then((val)=>{
            return val[0].insertId
        });
        setBodyContentEmail(index, {idContent, content, tipoDe});
    });
}
const updateContentEmail = async (idPost, oldContent, newContent) =>{
    
}
const getIDContentEmail = async objct=>{

}

module.exports = {getPostDetailsFromUser, createPostEmail, createContentEmail, getPostEmailByTitle, getIDPostEmail, getPostsFromUser, getPostEmailBySubject, getContentEmailByIDPost};