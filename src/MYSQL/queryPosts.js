const mysql = require('mysql');
const {keys} = require('../Keys/KeyMysql');

var pool = mysql.createPool(keys);
const SELECT_POST = ""
const SELECT_TWO_TABLES = "SELECT postEmail.idAuthor,author.nombre,author.email,postEmail.tituloPost FROM postEmail INNER JOIN author ON postEmail.idAuthor = author.idauthor WHERE nombre= ?;"
const UPDATE_TWO_TABLES = " UPDATE author SET publicaciones=(SELECT COUNT(idAuthor) FROM postEmail WHERE idAuthor = ?) WHERE idauthor = ?;"
const SELECT_POST_FROM_USER = "SELECT postemail.title, postemail.fechaCreacion, postemail.link, postemail.estado FROM author INNER JOIN postemail ON author.idauthor = postemail.idAuthor WHERE author.nombre = ?;"

const getPosts = (numberPost = 5)=>{
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err
            }
            connect.query(`SELECT * FROM post LIMIT ?`,numberPost,(err,result)=>{
                resolve(result);
                connect.release();
                if (err) {
                    reject(err)
                }
            })
        })
    })
}
const createPosts=(object)=>{
    var {idAuthor, tituloPost, descripcion, comentarios, imagen, fechaCreacion} = object;
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err;
            }
            connect.query(`INSERT INTO post (idAuthor, tituloPost, descripcion, comentarios, imagen, fechaCreacion) VALUES ?`,[[[idAuthor, tituloPost, descripcion, comentarios, imagen, fechaCreacion]]],(err)=>{
                resolve();
                connect.release();
                if (err) {
                    console.log(err);
                    reject(err);
                }
            })
        })
    });
}

module.exports = {getPosts, createPosts}