const mysql = require('mysql')
const {keys} = require('../Keys/KeyMysql')

var pool = mysql.createPool(keys)

const getAuthor = function (user) {
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

const createAuthor = function (object) {
    var {nombre, bio,  publicaciones} = object
    return new Promise((resolve, reject)=>{
        pool.getConnection((err,connect)=>{
            if (err) {
                throw err
            }
            connect.query(`INSERT INTO author (nombre, bio,  publicaciones) VALUES ? `,[[[nombre,bio, publicaciones]]],(err)=>{
                resolve(201)
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
module.exports = {createAuthor,updateAuthor,getAuthor}