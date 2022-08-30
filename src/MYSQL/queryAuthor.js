const mysql = require('mysql')
const {keys} = require('../Keys/KeyMysql')
var pool = mysql.createPool(keys);

const INSERT_QUERY = "INSERT INTO author (nombre, publicaciones, email, suscripcion, contrasenna, contrasenn_hash ) VALUES ?";
const SELECT_QUERY = "SELECT * FROM author ";
const SELECT_QUERY_NOMBRE = "SELECT * FROM author WHERE nombre = ?";

const getAuthorByName = function (user) {
    var name = user
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err
            }
            connect.query(SELECT_QUERY_NOMBRE,name,(err,result)=>{
                resolve(result)
                connect.release();
                if (err) {
                    reject(err)
                }
                
            })
        })
    })
}
const getAuthorById = function (idAuthor) {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err
            }
            connect.query('SELECT * FROM author WHERE idauthor = ?', idAuthor, (err,result)=>{
                resolve(result);
                connect.release();
                if (err) {
                    reject(err)
                }
            })
        })
    })
}
const getAuthorByEmail = function (email) {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err
            }
            connect.query(`SELECT * FROM author WHERE email = ? `,email,(err,result)=>{
                resolve(result)
                connect.release();
                if (err) {
                    reject(err)
                }
                
            })
        })
    })
}

const createAuthor = function (object) {
    var {nombre,  email, contrasenna, hash_contrasenna} = object;
    return new Promise((resolve, reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err
            }
            connect.query(INSERT_QUERY,[[[nombre, 0, email, 0,contrasenna, hash_contrasenna]]],(err)=>{
                resolve(object)
                connect.release()
                if (err) {
                    console.log(err);
                    reject(404)
                }
            })
        })
    })    
}

const updateAuthor = function (object) {
    var {nombre,bio} = object
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err
            }
            connect.query(`UPDATE author SET bio = ? WHERE nombre = ?`,[bio,nombre],(err,result)=>{
                resolve(201)
                connect.release()
                if (err) {
                    reject(404)
                }
            })
        })
    })
}
module.exports = {createAuthor,updateAuthor,getAuthorByName, getAuthorByEmail, getAuthorById}