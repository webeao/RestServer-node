require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Convención para obtener
app.get('/usuario', function (req, res) {
    res.json('Posi es GAY')
});
// POST convencion para crear 
app.post('/usuario', function (req, res) {

 

    let body = req.body;

    if ( body.nombre === undefined){
            res.status(400).json({
                ok: false,
                mensaje: 'El nombre es necesario'
            })
    }else{
    res.json({
        persona: body
    });
}
});
// PUT convención para actualizar datos
app.put('/usuario/:id', function (req, res) {
let id = req.params.id;
    res.json({
        id
    });
});
// DELETE convención para eleiminarr 
app.delete('/usuario', function (req, res) {
    res.json('Hello word')
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT)
});