const controladorPost ={
    counter : 0,
    bodyEmail : {},
    elementsContent : [],
    elementsBodyEmail : [],
    getIdPost : function () {
        return this.bodyEmail.idPost;
    },
    getTitlePost : function () {
        return this.bodyEmail.title;
    },
    setBodyEmail : function (objc) {
        this.bodyEmail = objc;
    },
    setBodyContentEmail : function (index,objc) {
        const {idContent, content, tipoDe} = objc;
        this.elementsContent[index] = {idContent, content, tipoDe};
        this.bodyEmail.contentEmail = this.elementsContent;
    },
    getBodyEmail : function () {
        return this.bodyEmail;
    },
    setIdPost : function (idPost) {
        this.bodyEmail.idPost = idPost;
    },
    getPostDetails : function () {
        const idPost = this.bodyEmail.idPost;
        const title = this.bodyEmail.title;
        const fechaCreacion = this.bodyEmail.fechaCreacion;
        const link = this.bodyEmail.link;
        return {idPost, title, fechaCreacion, link};
    },
    getElementsBodyEmail : function () {
        return this.elementsBodyEmail;
    }
}
module.exports = {controladorPost}