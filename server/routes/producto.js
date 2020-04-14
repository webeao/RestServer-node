const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')
const app = express();
const Producto = require('../models/producto');


//================================
//Obtener productos
//================================
app.get('/producto', (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        //Populate: en el primer parametro se le pasa el objectid
        // y en el segundo los datos que queremos debolver 
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });


        });

});

app.get('/producto/:id', (req, res) => {
    let id = req.params.id

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se encontro una categoria con el Id'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    });

});

//================================
//Crear producto
//================================

app.post('/producto', verificaToken, (req, res) => {
    // regresa la nueva categoria
    //req.usuario._id

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descricion: body.descricion,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            //500 Internal Server Error
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //status 201 Created, insercion en la base de datos
        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
});

//================================
//Editar producto
//================================

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    
    Producto.findById(id, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe '
                }
            });

        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

productoDB.save((err,productoGuardado) =>{
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    res.json({
        ok: true,
        producto:productoGuardado
    })
})
   
    });

});


//================================
//Eliminar producto
//================================


app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
   
    let id = req.params.id;
    Producto.findOneAndRemove(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err


            });

        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    });

});


//================================
//Busquedas en base de datos, buscar producto
//================================

app.get('/producto/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino
//crear una exprecion regular de la variable termino con  RegExp para hacer una busqueda mas 
//RegExp flags 'i' ignorar mayúsculas o minúsculas
    let regex = new RegExp(termino, 'i')

Producto.find({nombre: regex})
.populate('categoria', 'nombre')
.exec((err,productos)=>{

if(err){
return res.status(500).json({
    ok:false,
    err    
});
}

if(productos.length === 0){
    return res.status(400).json({
        ok: false,
        err:{
           message: `no se encontraron resultados para ${regex}`
        }
    })

}

res.json({
    ok: true,
    productos
})

})

})



module.exports = app;