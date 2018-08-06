var User = require('../models/user');


// save users to the database
module.exports.createUser = function(data) {
	var newUser = new User(data).save();

	return newUser;
};

// List the users
module.exports.getUsers = function(query = {}, project = {}) {
	 return User.find(query, project).lean().exec();
};

// show user to the edit form
module.exports.getUser = function(query = {}) {
	 return User.findOne(query).lean().exec();// .lean will return the document as a plain JavaScript object rather than a mongoose document improve the perfomance for find query
};

//post edit form
module.exports.updateUser = function(query = {}, data = {}) {
	 return User.update(query, data).exec();
};

//for pagination



module.exports.paginateUser = function(query = {}, options= {}) {
	return User.paginate(query, options);
};
//for fileupload
module.exports.fileUpload = function(data) {
	var newUser = new User(data).save();

	return newUser;
};