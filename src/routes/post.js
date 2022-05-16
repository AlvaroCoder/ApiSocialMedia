const router = require('express').Router();
const queryPost = require('../MYSQL/queryPosts');
const queryAuthor = require('../MYSQL/queryAuthor');
const controlador = {
    getPosts : async function (req,res){
        var posts = await queryPost.getPosts();
        for (let index = 0; index < posts.length; index++) {
            const element = posts[index];
            const id = element.idAuthor
            var author = await queryAuthor.getAuthorById(id)
            posts[index].author = author[0].nombre
        }
        res.type('json').send(posts)
    }
}
router.get("/", controlador.getPosts)
module.exports = router