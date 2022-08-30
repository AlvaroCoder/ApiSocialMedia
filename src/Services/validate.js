function Validar(data={}){
    var error = {}
    var { nombre, email, contrasenna } = data
    if ( email == '' || contrasenna == '' || nombre == '') {
        error.message = "Llene el formulario"
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        error.message = "Email inválido"
    }    
    return error;
}

module.exports = {
    Validar : Validar
}