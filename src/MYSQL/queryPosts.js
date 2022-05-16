const mysql = require('mysql')
const {keys} = require('../Keys/KeyMysql');

var pool = mysql.createPool(keys);

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
module.exports = {getPosts}