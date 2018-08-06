var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');//include for pagination
// status => 0 = inactive, 1 = active
// role => 1 = user, 2 = admin

var userSchema = mongoose.Schema({
	fname : { type: String, default: "" },
	password : { type: String, default: "" },
	email : { type: String, default: "" },
	status : { type : Number, default: 1 },
	role : { type : Number, default: 1 },
	date : { type : Date , default: "" },
	image: { type :String , default: ""},
	imagefile: { type :String , default: ""}
}, 
{ 
	timestamps: true 
});
// for pagination plugin
userSchema.plugin(mongoosePaginate);




module.exports = mongoose.model('User', userSchema);

