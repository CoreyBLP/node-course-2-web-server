const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

var maintenanceMode = false;

hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine','hbs');


app.use((req,res,next)=>{
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log+'\n', (err)=>{
		if(err){
			console.log("unable to append!");
		}
	});
	next();
});

app.use((req,res,next)=>{
	if(maintenanceMode){
		res.render('maintenance.hbs');
	}else{
		next();
	}
});

app.use(express.static(__dirname+'/public'));

hbs.registerHelper('getCurrentYear',()=>{
	return new Date().getFullYear()
});

hbs.registerHelper('screamer', (text)=>{
	return text.toUpperCase()
});

app.get('/', (req,res)=>{
	//res.send('<h1>Hello Express</h1>');
	/*res.send({
		name:'Bubby',
		likes:['Ghouls, Pizza']
	});*/
	res.render('home.hbs',{
		pageTitle: 'Home',
		welcomeMsg:'welcome to your doom'
	})
});

app.get('/about',(req,res)=>{
	//res.send('About Page');
	res.render('about.hbs', {
		pageTitle: 'About'
	});
});

app.get('/projects',(req,res)=>{
	res.render('projects.hbs', {
		pageTitle: 'Projects'
	});
});

// /bad route - send back json data with errorMessage property
app.get('/bad',(req,res)=>{
	res.send({
		errorMessage:'Oh dang! That is an error'
	});
});


//port set by heroku - env variable
//listen accepts port argument
app.listen(port, ()=>{
	console.log(`Server running: port ${port}`);
});