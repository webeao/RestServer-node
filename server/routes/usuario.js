const express = require('express');
var nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const autenticacion = require('../middlewares/autenticacion');

const app = express();

//Convención para obtener
app.get('/usuario', autenticacion.verificaToken, (req, res) => {

  

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });


        });


});


// POST convencion para crear 
app.post('/usuario',[autenticacion.verificaToken,autenticacion.verificaAdmin_Role], function(req, res) {
console.log(req.body);
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });
    // En la siguiente linea usuarioDB es la respuesta del usuario que se grabo en mongo
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password= null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});



// PUT convención para actualizar datos
app.put('/usuario/:id',[autenticacion.verificaToken,autenticacion.verificaAdmin_Role], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado', 'img']);

//{new:true, runValidators: true} para que no choque con nuestras validaciones

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});
// DELETE convención para eleiminarr 
app.delete('/usuario/:id', [autenticacion.verificaToken,autenticacion.verificaAdmin_Role],function  (req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        };

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioBorrado

        });

    });


    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
         if (err) {
             return res.status(400).json({
                 ok: false,
                 err
             });
         };
         if (!usuarioBorrado) {
             return res.status(400).json({
                 ok: false,
                 err: {
                     message: 'Usuario no encontrado'
                 }
             });
         };
         res.json({
             ok: true,
             usuario: usuarioBorrado
         });
 
     });*/
//---------------------------------------------------------------------------------



//----------------------------------------------------------------------------------
});

module.exports = app;