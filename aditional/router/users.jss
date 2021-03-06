var express = require('express');
//for configure the date display format yyyy-mm-dd
var moment = require('moment');
var router = express.Router();
var userService = require('../services/user.Services');
//for fileupload
var multer = require('multer');
// for password bcrypt
var bcrypt = require('bcrypt');
var saltRounds = 10;
//for delete a file
var fs = require('fs');


var ObjectId = require('mongodb').ObjectId
//file upload
var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './public/uploads');  
  },  
  filename: function (req, file, callback) {  
    
    callback(null, Date.now() + '-' + file.originalname );  
  }  
});  
var upload = multer({ storage : storage});
	router.post('/profile-image-upload/:id', upload.single("image"), async function(req, res, next) {
	// id and old_image_id from form post
	try {
		var oldFileName = req.body.imgdelete;
		var o_id = req.params.id;
		//console.log(req.file);
		if(req.file){

			var edituser = await userService.updateUser( {_id: o_id},
			{ $set: 
				{ 	image: req.file.originalname, 
					imagefile: req.file.filename
			}
			});

			fs.unlink('./public/uploads/'+oldFileName, (err) => {
				console.log('successfully deleted old image');
			});

			res.json({ success:1 , imagefile: req.file.filename });
			}else{
				res.json({ success:0 });
			}
	} catch(e) {
		res.json({ success:0 });
	}

	});
//list all users when router get /users

router.get('/', function(req, res, next) {

res.render('listuser');
});
//for ajx request
// router.get('/ajax/get-users', function(req, res, next) {

// userService.getUsers()
// 	.then(function(result){
// 	res.json({ success: 1, result: result });
// 	})
// 	.catch(function(e){
// 	res.json({ success: 0, result: [] });
// 	})
// });

//forpagination
router.get('/ajax/get-users', function(req, res, next){

console.log(req.query);
	var options = {
		lean:     true,
		offset:   parseInt(req.query.offset), //parses a string and returns an integer.
		limit:    parseInt(req.query.limit)
	};
	userService.paginateUser({}, options)
	.then(function(result){
		res.json({ success:1, rows: result.docs, total:result.total });
	})
	.catch(function(e){
		res.json({ success:0, rows: [] });
	})
});


// show the edit form when router get /user/edit-click the edit button
// router.get('/edit/(:id)', function(req, res, next) {

// 	 res.render('edit');

// 	});

router.get('/edit/:id', async function(req, res, next) {
	try {
		var o_id = req.params.id;
		var user = await userService.getUser({ _id: o_id });
		user.date = moment( user.date ).format('YYYY-MM-DD');
		res.render('edit', { user: user });
	} catch(e) {
		res.render('edit')
	}	
});
 router.post('/edit/:id', async function(req, res, next) {
 	 try {
 	 	var o_id = req.params.id;


 	 	var edituser = await userService.updateUser( {_id: o_id}, 
 	 		{ $set: 
 	 			{ fname: req.body.fname,
 	 			  email: req.body.email,
 	 			  date: req.body.date,
 	 			  role: req.body.role,
 	 			  status: req.body.status
 	 			}
 	 		});

 	 	var user = await userService.getUser({ _id: o_id });
 	 	user.date = moment( user.date ).format('YYYY-MM-DD');
 	  	 res.redirect('/users');

		 // res.render('edit', { success: true, user: user });
 	 } catch(e) {
 	 	
 	 	res.render('edit', { success: false })
 	 }

 });

router.post('/delete', async function(req, res, next) {
    try {
    	var o_id = req.body.id;
    	var result = await userService.updateUser( 
    		{_id: o_id}, 
 	 		{ $set: { status: 0 }

 	 		 }
 	 	); 

 	 	res.json({ success: 1 });
    } catch(e) {
 	 	res.json({ success: 0 });

    }
});
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('welcome');
// });
router.get('/userlogin', function(req, res, next){
	res.render('login');
});

module.exports = router;
