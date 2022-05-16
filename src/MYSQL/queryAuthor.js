const mysql = require('mysql')
const {keys} = require('../Keys/KeyMysql')

var pool = mysql.createPool(keys)

const getAuthorByName = function (user) {
    var name = user
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err
            }
            connect.query(`SELECT * FROM author WHERE nombre = ? `,name,(err,result)=>{
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
    var {nombre,  email, contrasenna, hash_contrasenna, token} = object
    return new Promise((resolve, reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err
            }
            connect.query(`INSERT INTO author (nombre, bio,  publicaciones, email, suscripcion, contrasenna,seguidores, seguidos, comentarios, contrasenn_hash, token ) VALUES ? `,[[[nombre, '', 0, email, 0,contrasenna, 0,0,0,hash_contrasenna, token]]],(err)=>{
                resolve(token)
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