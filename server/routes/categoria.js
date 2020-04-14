const express = require('express');
//destructuracion de la clase autenticacion 
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

const Categoria = require('../models/categoria');

//================================
//Mostrar todas las categorias
//================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
    //Populate: en el primer parametro se le pasa el object id
    // y en el segundo los datos que queremos debolver 
    .populate('usuario', 'nombre id')
    .sort('descripcion')
    .exec((err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });


    });


    //================================
    //Mostrar una categoria por ID
    //================================
    app.get('/categoria/:id', (req, res) => {
        let id = req.params.id

        Categoria.findById(id, (err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No se encontro una categoria con el Id'
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });


        });

    });

    //================================
    //Crear una categoria nueva
    //================================
    app.post('/categoria/', verificaToken, (req, res) => {
        // regresa la nueva categoria
        //req.usuario._id

        let body = req.body;

        let categoria = new Categoria({
            descripcion: body.descripcion,
            usuario: req.usuario._id
        });

        categoria.save((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });

        });
    });


    //================================
    //Editar una categoria nueva
    //================================
    app.put('/categoria/:id', verificaToken, (req, res) => {

        let id = req.params.id;
        let body = req.body;
        //{new:true, runValidators: true} para que no choque con nuestras validaciones
        Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: categoriaDB
            });
        });
        // regresa la nueva categoria
        //req.usuario._id
    });


    //================================
    //Eliminar una categoria nueva
    //================================
    app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

        let id = req.params.id;
        Categoria.findOneAndRemove(id, (err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err


                });

            };

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                })
            }

            res.json({
                ok: true,
                categoria: categoriaBorrada
            });


        });

    });

});



module.exports = app;