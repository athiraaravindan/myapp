var express = require('express');
var router = express.Router();
var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });
var userService = require('../services/user.Services');

//for socket io
var app = require('express')();
var http = require('http').Server(app);
var jwt = require('jsonwebtoken');
var config = require('../config');
var bcrypt = require('bcrypt');
var validateSchema = require('../json/validation');
//for password bcrypt
var bcrypt = require('bcrypt');
var saltRounds = 10;




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//for get register page
router.get('/register', async function(req, res, next) {
  try{
    res.locals.success = true;
    res.locals.msg = false;
    res.render('register');
  } catch(e)
  {
    res.render('register')
  }
  res.render('register', { title: 'Registration Form' });
});
router.post('/register', validateSchema({ schemaName: 'new.user', view: 'register'}),
  async function(req, res, next) {
    // var cpassword = req.body.cpassword;
    // console.log(cpassword);
try{
  var check = await userService.getUser({ email: req.body.email });
  if(check){
    res.locals.success = false;
    res.render('register');
  } else{
    req.body.password = req.body.password.trim();
    req.body.cpassword = req.body.cpassword.trim();

    if(req.body.password && (req.body.password === req.body.cpassword)){
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
        // res.render('register');
          res.redirect('/login');
         } else{
          res.locals.success = true;
          res.locals.msg = true;
          res.render('register')
       
          // res.send('password not matching');
         }
      }
     
  } catch(e) {
  
    console.log(e);
    res.locals.title = 'Registration Form';
    res.locals.success = false;
    res.render('register');
  }
});


//for fileupload
var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './public/uploads');  
  },  
  filename: function (req, file, callback) {  
    
    callback(null, Date.now() + '-' + file.originalname );  
  }  
});  
var upload = multer({ storage : storage});  
  
router.get('/fileupload',function(req,res){  
      res.render('fileupload');  
});  
  
router.post('/fileupload', upload.single('image'), function(req,res){  
  console.log(req.file);
  res.send(req.file)  
});  

  //for login
  router.get('/login', async function(req, res, next){
    try{
      res.locals.success = true;
      res.render('login');
    } catch(e){
    res.render('login');
  }
  });
  router.post('/login',async function(req, res, next){
    try{
      var userEmail = req.body.email;
      var userPassword = req.body.password;
    
      var user = await userService.getUser({ email: userEmail });

      if(user){
          var oldPassword = user.password;
           var role = user.role;
              var result = await bcrypt.compare(userPassword, oldPassword);
              // console.log(res);
              if(result){
              // res.render('adminpanel');
              var token = jwt.sign({ name: user.fname , id:user._id, role:user.role }, config.secret);
              console.log(token);
              res.cookie('token', token, { signed: true });
              res.redirect('/users')
       
             } else{ 
              res.locals.success = false;
              res.render('login');
               }
        } else{
          res.locals.success = false; 
          res.render('login'); 
        }
    } catch(e){
      res.locals.success = false;
      res.render('login');
      
    }

  });
  router.get('/logout',function(req, res, next){
    try{
      res.clearCookie('token');
      res.redirect('/login');
    } catch(e){
      res.redirect('/login');
    }
    
  });


module.exports = router;
