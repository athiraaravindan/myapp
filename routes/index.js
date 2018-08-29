var express = require('express');
var router = express.Router();
var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });
var userService = require('../services/user.Services');
var fs = require('fs');

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
    res.render('index', {
        title: 'Express'
    });
});
//for get register page
router.get('/register', async function(req, res, next) {
  console.log(req)
    try {
        res.locals.success = true;
        res.locals.msg = false;
        res.render('register');
    } catch (e) {
        res.render('register')
    }
    // res.render('register', {
    //     title: 'Registration Form'
    // });
});
router.post('/register', validateSchema({
        schemaName: 'new.user',
        view: 'register'
    }),
    async function(req, res, next) {
        // var cpassword = req.body.cpassword;
        // console.log(cpassword);

        try {
            var check = await userService.getUser({
                email: req.body.email
            });

            if (check) {
                res.locals.success = false;
                 

                // res.render('register');
            } else {
                req.body.password = req.body.password.trim();
                req.body.cpassword = req.body.cpassword.trim();

                if (req.body.password && (req.body.password === req.body.cpassword)) {

                    //for save the password in db save the hash value only
                    var hash = await bcrypt.hash(req.body.password, saltRounds);
                    let usr = {
                        fname: req.body.fname,
                        email: req.body.email,
                        password: hash,
                        // date: req.body.date
                    };
                  
                    var createUser = await userService.createUser(usr)
                    res.locals.success = true;
                   
                    // res.render('register');
                    res.redirect('/login');
                } else {
                    res.locals.success = true;
                    res.locals.msg = true;
                    // res.render('register')
                   
                    // res.send('password not matching');
                }
            }

        } catch (e) {

            console.log(e);
            res.json({status: 'fail'});
            res.locals.title = 'Registration Form';
            res.locals.success = false;
            // res.render('register');
        }
    });


//for login
router.get('/login', async function(req, res, next) {
    try {
        res.locals.success = true;
        res.render('login');
    } catch (e) {
        res.render('login');
    }
});
router.post('/login', async function(req, res, next) {
    try {
        var userEmail = req.body.email;
        var userPassword = req.body.password;

        var user = await userService.getUser({
            email: userEmail
        });
        if (user) {
            var oldPassword = user.password;
            var role = user.role;
            var result = await bcrypt.compare(userPassword, oldPassword);
            // console.log(res);
            if (result) {
                // res.render('adminpanel');
                var token = jwt.sign({
                    name: user.fname,
                    id: user._id,
                    role: user.role
                }, config.secret);
                console.log(token);
                res.cookie('token', token, {
                    signed: true
                });
               
                res.redirect('/users')

            } else {
                res.locals.success = false;
                res.json({status :'password not matching'});
                // res.render('login');
            }
        } else {
            res.locals.success = false;
            res.json({status : 'user not found'});
            // res.render('login');
        }
    } catch (e) {
        res.locals.success = false;
        res.json({status : 'fail to login'});
        // res.render('login');

    }

});
router.get('/logout', function(req, res, next) {
    try {
        res.clearCookie('token');
        res.redirect('/login');
    } catch (e) {
        res.redirect('/login');
    }

});


// save data get from angular

router.post('/register1',async function(req, res, next) {

    try {

        var check = await userService.getUser({
            email: req.body.email
        });
        if (check) {
             res.json({status: 'email exit'});
        } else {
            req.body.password = req.body.password.trim();
            req.body.cpassword = req.body.cpassword.trim();

            if (req.body.password && (req.body.password === req.body.cpassword)) {

                //for save the password in db save the hash value only
                var hash = await bcrypt.hash(req.body.password, saltRounds);
                let usr = {
                    fname: req.body.fname,
                    email: req.body.email,
                    password: hash,
                    
                };

                res.json({status: 'success', response: 'register successfully'});
                var createUser = await userService.createUser(usr)   
            } else {   
                res.json({status: 'error',response: 'password and confirm_password not matching'});    
            }
        }
    } catch (e) {

            console.log(e);
            res.json({status: 'fail'});        
        }
    });
router.post('/login1', async function(req, res, next) {
    try {
        var userEmail = req.body.email;
        var userPassword = req.body.password;

        var user = await userService.getUser({
            email: userEmail
        });
        if (user) {
            var oldPassword = user.password;
            var role = user.role;
            var result = await bcrypt.compare(userPassword, oldPassword);
            // console.log(res);
            if (result) {
                // res.render('adminpanel');
                var token = jwt.sign({
                    name: user.fname,
                    id: user._id,
                    role: user.role
                }, config.secret);
                console.log(token);
                res.json({status : 'login successfully', token: token, name: user.fname,image:user.imagefile,role:user.role });

                // res.redirect('/users')

            } else {
                res.locals.success = false;
                res.json({status :'password not matching'});
                // res.render('login');
            }
        } else {
            res.locals.success = false;
            res.json({status : 'user not found'});
            // res.render('login');
        }
    } catch (e) {
        res.locals.success = false;
        res.json({status : 'fail to login'});
        // res.render('login');

    }

});
 router.get('/get-users', function(req, res, next) {

 userService.getUsers()
    .then(function(result){
    res.json({status:'success' ,res: result });
    })
    .catch(function(e){
    res.json({ status:'error', result: [] });
    })
});

 router.post('/delete', async function(req, res, next) {
    try {
        var o_id = req.body.id;
        // res.json({ user_id:o_id});
        var result = await userService.deleteUser( 
            {_id: o_id}
            
        ); 

        res.json({ success: 'user deleted successfully' });
    } catch(e) {
        res.json({ success: 0 });

    }
});
 router.get('/edit/:id', async function(req, res, next) {
    try {
        var o_id = req.params.id;
        var user = await userService.getUser({ _id: o_id });
        res.json({status: "success", user: user});
            
    } catch(e) {
        res.json({status:"error"});
    
    }   
});
  router.post('/edit', async function(req, res, next) {
     try {
        var o_id = req.body.id;
        var edituser = await userService.updateUser( {_id: o_id}, 
            { $set: 
                { fname: req.body.fname,
                  email: req.body.email,
                  role: req.body.role,
                  status: req.body.status
                }
            });
            res.json({status:"success"})
        // var user = await userService.getUser({ _id: o_id });
  
     } catch(e) {
        
        res.json({ success: "error"})
     }

  });
  //for file upload
 


  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
      var filename = file.originalname.split(" ").join("_");
      var newname= Date.now() + '-' + filename;
      console.log(file,"thhi is new file");
      callback(null, newname);
      
    }
  });

  var upload = multer({ storage: storage });
  router.post('/fileupload',upload.single('photo'), function (req, res) {
    // console.log(req.file.filename,"image name got");
      if (!req.file) {
          console.log("No file received");
          return res.json({success: false});
      
        } else {
          console.log('file received');
          
          return res.json({
            success: true,
            picname:req.file.filename 
          })
        }
  });
   

  router.post('/picupload', async function (req, res, next) {
    try {
      var o_id = req.body.id;
      var pic = req.body.picname;
      var oldFileName = req.body.imgdelete;
      var edituser = await userService.updateUser({ _id: o_id },
        {
          $set:
          { image:req.body.originalname,    
            imagefile: pic
            
          }
        });

      fs.unlink('./public/uploads/'+oldFileName, (err) => {
        console.log('successfully deleted old image');
      });
      res.json({ success: true, user: 'success',image:pic});
    } catch (e) {

      res.json( { success: false })
    }

  });


module.exports = router;