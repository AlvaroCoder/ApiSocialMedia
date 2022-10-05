require('dotenv').config();
const mysql2 = require('mysql2/promise');
const {keys} = require('../Keys/KeyMysql');
const poolRoute = keys
const pool = mysql2.createPool(poolRoute);
const {setBodyEmail, setBodyContentEmail, getElementsBodyEmail} = require('../Services/PostClass').controladorPost;

const GET_POSTS_FROM_USER = "SELECT  author.nombre, postemail.identifier, postemail.idPostEmail, postemail.fecha_creacion, estado.estado, postemail.SubjectEmail, postemail.Time2send FROM author INNER JOIN postemail ON author.idAuthor = postemail.Author_idAuthor INNER JOIN estado ON postemail.Estado_idEstado = estado.idEstado WHERE author.nombre = ?;"
const GET_CONTENT_BY_IDPOST= " SELECT ;";
const GET_TO_USER_BY_IDPOST = "SELECT email FROM destinityemail WHERE PostEmail_idPostEmail = ?;";
const GET_ROWS_STRUCTURE_POST = "SELECT  middlepostrowscolores.idMiddlePostRowsColores, rowsstructure.nombreRow AS categoria_structure , middlepostRowsColores.heigth, colores.class AS bg_color FROM middlepostrowscolores INNER JOIN colores ON middlepostrowscolores.Colores_idColores = colores.idColores INNER JOIN rowsstructure ON middlepostrowscolores.idRowsStructure = rowsstructure.idRowsStructure  WHERE idPostEmail = ?;"
const GET_ROWS_POST = "SELECT middlerowscols.idMiddlePostRowsColores AS idMiddleRowsCols,middlerowscols.padding_left, middlerowscols.padding_rigth, middlerowscols.padding_top, middlerowscols.padding_bottom, middlerowscols.space_inline, middlerowscols.corner_radius, middlerowscols.num_cols, colores.class AS bg_color FROM middlerowscols INNER JOIN colores ON middlerowscols.Colores_idColores = colores.idColores WHERE middlerowscols.idMiddlePostRowsColores = ?;";
const GET_COLS_POST = "SELECT * FROM middlecolsblock WHERE idMiddleRowCols = ?;"

const GET_IDAUTHOR_NAME = "SELECT idAuthor FROM author WHERE nombre = ?;";
const GET_IDPOST_EMAIL = "SELECT idPost FROM postemail WHERE subjectEmail = ? AND identifier = ?;";
const GET_POSTEMAIL_BY_SUBJECT = "SELECT postemail.idPostEmail, postemail.identifier, postemail.SubjectEmail, estado.estado, postemail.fecha_creacion, postemail.Time2Send FROM postemail INNER JOIN estado ON postemail.Estado_idEstado = estado.idEstado WHERE SubjectEmail = ? AND identifier = ?;"
const GET_IDENTIFIERS_EXIST = "SELECT idPostEmail FROM postemail WHERE identifier = ?;"

const CREATE_POST_EMAIL = "INSERT INTO postemail (identifier, subjectEmail, fecha_creacion, Time2send, Author_idAuthor, Estado_idEstado) VALUES (?,?,?,?,?,?);";
const CREATE_POST_CONTAINER_ROW = "INSERT INTO middlepostrowscolores (idRowsStructure,idPostEmail, Imagenes_idImagenes, Colores_idColores) VALUES (?,?,?,?);";
const CREATE_POST_ROW = "INSERT INTO middlerowscols (idMiddlePostRowsColores, idRowsStructure, idPostEmail, Colores_idColores) VALUES (?,?,?,?);"
const CREATE_POST_COL = "INSERT INTO middlecolsblock (indexCols, idMiddleRowCols) VALUES(?,?);"

const INSERT_VALUES_CONTENTEMAIL = "INSERT INTO contentEmail (idPost, content, tipoDe) VALUES (?, ?, ?);"

const generateCode = ()=>{
    const base = 'abcdefghijklmopqrstuvxyzABCDEFGHIJKLMNOPQRSTUXYZ0123456789'
    let passwor = ''
    for (let index = 0; index < 15; index++) {
        let num_random = Math.floor(Math.random()*base.length)
        passwor+=base.charAt(num_random);
    }
    return passwor;
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
    return postDetails;
}
const getPostEmailBySubject = async (subject, identifier) =>{
    const posts =  await pool.query(GET_POSTEMAIL_BY_SUBJECT, [subject,identifier]).then(([rows, field])=>{
        return rows;
    });
    
    const copy = posts[0] || [];
    const toUsers = await pool.query(GET_TO_USER_BY_IDPOST, [copy.idPost]).then(([rows, field])=>{
        return rows
    }) ;
    copy.destiny = toUsers;
    const rowsStructure = await pool.query(GET_ROWS_STRUCTURE_POST,[copy.idPostEmail]).then(([row,field])=>{
        return row
    });
    const cont = []
    for (let index = 0; index < rowsStructure.length; index++) {
        let idMiddlePostRowsColores = rowsStructure[index]["idMiddlePostRowsColores"]
        const rows_post = await pool.query(GET_ROWS_POST,[idMiddlePostRowsColores]).then(([row,field])=>{
            return row
        });

        const cols_post = await pool.query(GET_COLS_POST,[rows_post[0]["idMiddleRowsCols"]]).then(([row,field])=>{
            return row  
        })
        let copy_item = rowsStructure[index]
        let copy_rows = rows_post[0]
        copy_rows.cols_email = cols_post
        copy_item.rowsEmail = copy_rows
        cont.push(copy_item)
    }
    copy.content = cont;
    return copy;
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
}
const createEmptyPost = async nombre => {
    const subjectEmail = 'Untitled';
    const fecha_creacion = new Date();
    const fecha_creacion_send = `${fecha_creacion.getFullYear()}-${fecha_creacion.getUTCMonth()}-${fecha_creacion.getUTCDate()} ${fecha_creacion.getHours()}:${fecha_creacion.getMinutes()}:${fecha_creacion.getSeconds()}`
    const time2send = `${fecha_creacion.getFullYear()}-${fecha_creacion.getUTCMonth()}-${fecha_creacion.getUTCDate()+1} 00:00:00`;
    const numRows = 3;
    const identifier = generateCode();
    const idAuthor = await pool.query(GET_IDAUTHOR_NAME, [nombre]).then(([row,field])=>{
        return row[0].idAuthor;
    });
    const existIdentifier = await pool.query(GET_IDENTIFIERS_EXIST,[identifier]).then(([row, field])=>{
        return row
    });
    while (identifier == existIdentifier[0]) {
        identifier = generateCode();
        existIdentifier = await pool.query(GET_IDENTIFIERS_EXIST,[identifier]).then(([row, field])=>{
            return row
        });
    };
    const idPost = await pool.execute(CREATE_POST_EMAIL,[identifier, subjectEmail, fecha_creacion_send, time2send, idAuthor, 1]).then(([rows,field])=>{
        return rows.insertId
    });
    console.log('insert Id Post = ',idPost);
    for (let index = 0; index < numRows; index++) {
        // Como mínimo cada post debe tener 
        // 3 filas structure
        // 1 fila de tabla en cada fila structure
        // 1 columna de tabla en cada fila de fila structure

        //Primero los structure rows
        const idContainerRow = await pool.execute(CREATE_POST_CONTAINER_ROW, [(index+1),idPost, null, 3]).then(([row, field])=>{
            return row.insertId;
        });

        //Luego las filas de la tabla.
        const idRow = await pool.execute(CREATE_POST_ROW, [idContainerRow, (index+1), idPost, 3]).then(data=>{
            return data[0].insertId;
        });
        //Luego las columnas de la tabla.
        await pool.execute(CREATE_POST_COL, [1, idRow]);
    }
    console.log('Creacion del post exitosa');
    return {identifier, subjectEmail}
}
const getIDPostEmail=async (title, identifier)=>{
    const field = await pool.query(GET_IDPOST_EMAIL,[title, identifier]).then(([rows,fields])=>{
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

module.exports = { createPostEmail, createContentEmail, createEmptyPost, getIDPostEmail, getPostsFromUser, getPostEmailBySubject, getContentEmailByIDPost};