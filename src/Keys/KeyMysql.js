require('dotenv').config();


const keys = {
    host : 'localhost',
    user : process.env.USER_MYSQL,
    password :process.env.PASS_MYSQL,
    connectionLimit : 10,
    database :process.env.DATABASE_MYSQL,
}

module.exports = { keys }