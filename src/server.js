const express = require('express');
const handlebars = require('express-handlebars');
const cors = require('cors');
const session = require('express-session');
const compression = require('compression');
const { urlencoded, json } = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

const mongoStore = require('connect-mongo');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

//Session config
app.use(
	session({
		store: mongoStore.create({
			mongoUrl:
				'mongodb+srv://alanshalem:contraseña12345@coderhouse.3wlof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
			mongoOptions: advancedOptions,
			ttl: 30, // 30 sec
		}),

		secret: 'S3CRET',
		resave: true,
		saveUninitialized: false,
		cookie: {
			maxAge: 10 * 60 * 1000, // 10 min
		},
	})
);

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(express.static('public'));

//auth Middleware
const auth = (req, res, next) => {
	if (req.session && req.session.user) return next();
	else return res.render('login');
};

app.get('/test', (req, res) => {
	res.render('login');
});

app.post('/login', (req, res) => {
	const { nombre } = req.body;
	req.session.user = nombre;
	req.session.id = req.session.id ? req.session.id + 1 : 1;
	res.cookie('isRegistered', 'true').render('home', {
		username: nombre,
	});
});

app.post('/logout', (req, res) => {
	req.session.destroy();
	res.render('logout');
});

module.exports = app;
