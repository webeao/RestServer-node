const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;


let usuarioShema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {

        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    img: {
        type: String,        
        required: false
    },
    role: {
        type: String,      
        default: 'USER_ROLE',
        enum: rolesValidos
        
    },
    estado: {
        type: Boolean,
        default: true

    },//Boolean
    google:    {
        type: Boolean,
        default: false
    } //Boolean

});

usuarioShema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioShema.plugin(uniqueValidator, {message: '{PATH} El email debe de ser unico'});

module.exports = mongoose.model(/*este es el nombre del modelo*/'Usuario', usuarioShema);