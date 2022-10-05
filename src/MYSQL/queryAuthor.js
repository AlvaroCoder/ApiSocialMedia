require('dotenv').config();
const mysql2 = require('mysql2/promise');
const {keys} = require('../config/KeyMysql');
const poolRoute =  process.env.DATABASE_URL || keys;
const pool = mysql2.createPool(poolRoute);
const fs = require('fs');
const path = require('path');

const INSERT_QUERY = "INSERT INTO author (nombre, email, password, password_hash, create_time ) VALUES (?,?,?,?,?);";

const GET_DATA_USER = "SELECT nombre, email, password, create_time, isLogin FROM author WHERE nombre = ?;";
const GET_DATA_USER_BY_EMAIL = "SELECT nombre, email, password, password_hash, create_time  FROM author WHERE email = ? ";
const GET_IDUSER_BY_NAME = "SELECT idAuthor FROM author WHERE nombre = ?;";
const GET_IMAGE_BY_ID_AUTHOR = "SELECT src, data, type FROM imagenes WHERE Author_idAuthor = ?;"

const UPDATE_PASSWORD_USER = "UPDATE author SET password = ?; "
const UPDATE_PROFILE_PHOTO = "UPDATE author SET "
const UPDATE_HAS_IMAGE_AUTHOR = "UPDATE author SET hasImage = ? WHERE idAuthor = ? ;"
const UPDATE_PASSWORD_AUTHOR = "UPDATE author SET password = ?, password_hash = ? WHERE idAuthor = ?;"

const INSERT_IMAGE = "INSERT INTO imagenes (src, data, type, Author_idAuthor) VALUES (?,?,?,?);"

const getAuthorByName = async function (nombre) {
    return await pool.query(GET_DATA_USER, [nombre]).then(([row, fields])=>{
        return row
    });
}
const getAuthorByEmail = async function (email) {
    return await pool.query(GET_DATA_USER_BY_EMAIL, [email]).then(([rows, field])=>{
        return rows
    });
}

const createAuthor = async function (object) {
    var {nombre,  email, contrasenna, hash_contrasenna} = object;
    const time = new Date()
    const time_send = `${time.getUTCFullYear()}-${time.getUTCMonth()}-${time.getUTCDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    console.log(time_send);
    await pool.execute(INSERT_QUERY, [nombre, email, contrasenna, hash_contrasenna, time_send])
}
const getImageByName = async(nombre)=>{
    const idAuthor = await pool.query(GET_IDUSER_BY_NAME,[nombre]).then(([row,field])=>{
        return row[0]
    });
    const image = await pool.query(GET_IMAGE_BY_ID_AUTHOR,[idAuthor]).then(([row,data])=>{
        row.map((img)=>{
            fs.writeFileSync(path.join(__dirname,'../Images'+img.idImagenes+'-spambot.png'), img.data);
        });
        return fs.readdirSync(path.join(__dirname,'../Images'))
    });
    return image;
}
const updatePasswordAuthor = async function (new_password, new_password_hash) {
    await pool.execute(UPDATE_PASSWORD_AUTHOR, [new_password, new_password_hash]);
}
const updateProfilePhoto = async function (nombre_author, nombre_image, data_image, type_img) {
    const idAuthor = await pool.query(GET_IDUSER_BY_NAME, [nombre_author]).then(([row, field])=>{
        return row
    })
    await pool.execute(INSERT_IMAGE, [nombre_image, data_image, type_img, idAuthor]);
    await pool.execute(UPDATE_HAS_IMAGE_AUTHOR, [1, idAuthor]);
}
module.exports = {createAuthor,updatePasswordAuthor,getAuthorByName, getAuthorByEmail, updateProfilePhoto, getImageByName}