var express = require('express');
var router = express.Router();
var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });
var userService = require('../services/user.Services');

//for socket io
var app = require('express')();
var http = require('http').Server(app);





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//for loading adminpage
router.get('/admin', function(req, res, next){
	res.render('adminpanel');
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
// router.get('/listtrial',function(req,res){  
//       res.render('listuser trial');  
// });  

// for socket io

  router.get('/socket', function(req, res){
    // res.render('index');
    res.render('chat');
     console.log(msg);
  });


module.exports = router;
