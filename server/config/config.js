//============================
//Puerto
//============================
process.env.PORT = process.env.PORT || 3000;


//============================
//Entorno
//============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//============================
//Vencimiento del token
//============================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//============================
//SEED de autenticacion
//============================
//60 Segundos
//60 minutos
//24 horas
//30 dias
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//============================
//Base de datos
//============================
let  urlDB;

if(process.env.NODE_ENV === 'dev'){
 urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb+srv://webeao:ht13CQPCAwXHOmnF@cluster0-wmhk9.mongodb.net/cafe'
}
process.env.URLDB =urlDB;



