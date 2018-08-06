var express = require('express');
var router = express.Router();
var userService = require('../services/user.Services');
var validateSchema = require('../json/validation');
//for password bcrypt
var bcrypt = require('bcrypt');
var saltRounds = 10;

/* GET Registration form. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Registration Form' });
});

/* POST Registration form. 
 to show the form route get /register because the route configure in the app.js
 */

router.post('/', validateSchema({ schemaName: 'new.user', view: 'register'}),
	async function(req, res, next) {
		// var cpassword = req.body.cpassword;
		// console.log(cpassword);
try{

	if(req.body.password === req.body.cpassword){
		//for save the password in db save the hash value only
		var hash = await bcrypt.hash(req.body.password, saltRounds);
			let usr = {
				fname: req.body.fname,
				email: req.body.email,
				password:hash,
				date: req.body.date
			};

			var createUser = await userService.createUser(usr)
			res.locals.success = true;
			res.render('register');
			 	// res.redirect('/admin');
			 } else{
			 	res.send('password not matching');
			 }
		 
	} catch(e) {
	
		console.log(e);
		res.locals.title = 'Registration Form';
		res.locals.success = false;
		res.render('register');
	}
});







module.exports = router;