var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser());

app.use(express.static(__dirname + '/public'));
let handlebars = require('./compilador_de_templates.js');


// Configuracion
var mongoose = require('mongoose');

// Le indicamos a Mongoose que haremos la conexión con Promesas
mongoose.Promise = global.Promise;

// Usamos el método connect para conectarnos a nuestra base de datos
mongoose.connect('mongodb://localhost:27017/registro', { useNewUrlParser: true })
        .then(() => {
            // Cuando se realiza la conexión, lanzamos este mensaje por consola
            console.log('La conexión a MongoDB se ha realizado correctamente!!');
        })
        .catch(err => console.log(err));
        // Si no se conecta correctamente escupimos el error

// Esquema
const Schema = mongoose.Schema;

// Schemas
const schemas = {
	usuarioSchema: new Schema({
    	username: {type: String},
    	password: {type: String},
    	email: {type: String}
	}, { collection: 'usuarios' })
}



// Modelo

const models = {
	Usuario: mongoose.model("usuarioSchema", schemas.usuarioSchema)
};


/**
 * Recepcion de los datos del formulario (formulario.html)
 * Recibo en la peticion (post -> body):
 * 		- usuario
 * 		- email
 * 		- password
 *
 * Debo validar que el usuario, email y password esten completos
 * 		- Si faltan datos => muestro template registro_con_errores.html
 * 		- Si estan completos => muestro template registro_ok.html
 */

app.post('/login', function(req, res) {
	var usuario = req.body.usuario;
	var password = req.body.password;
	var busqueda = {
		'username': usuario,
		'password': password
	}
	models.Usuario.find(busqueda)
		.then(function(respuesta) {
			if (respuesta.length==0) {
				// El vector tiene longitud 0 => no existe
				// el usuario/password en la base de datos
				res.redirect('/formulario.html');

      } else {
				// Ok, existe el usuario/password
				res.redirect('/bienvenido.html');
			}
		})
		.catch(function(error) {
			console.log('No se pudo realizar la operacion');
		});
});


app.post('/registracion', function(req, res) {
	var usuario = req.body.usuario;
	var password = req.body.password;
	var busqueda = {
		'username': usuario,
		'password': password,
	}
  var registro = new models.Usuario({ 'usuario': req.body.usuario, 'email': req.body.email, 'password': req.body.password });

     registro.save()
         .then(function (usuario) {
             console.log('hola');


         				res.redirect('/bienvenido.html');
         })
		.catch(function(error) {
			console.log('No se pudo realizar la operacion');
      res.send(error);
		});
});


app.listen(3000, function () {
  console.log('Practica 18 escuchando en el puerto 3000!');
});
