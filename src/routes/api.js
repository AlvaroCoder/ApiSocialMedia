const router = require("express").Router()
const author = require("./author")
const post = require("./post")
const multer = require('multer');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination :  path.join(__dirname, '../Imagenes'),
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-app-'+file.originalname)
    }
});
const fileUpload = multer({
    storage : diskStorage
}).single('image');

router.use("/author",fileUpload,author);
router.use("/post",post);

module.exports = router;