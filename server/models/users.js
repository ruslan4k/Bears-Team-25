// load the things we need
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;
// define the schema for our user model

var serviceSchema = mongoose.Schema({
    service: String,
    isWebhooks: Boolean,
    isActions: Boolean
})

var userSchema = mongoose.Schema({
    name: String,
    local: {
        username: String,
        password: String,
        email: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    appletIds: [
        {
            type: String
        }
    ],
    activity:[
    	{
    		date:{ type: Date, default: Date.now },
    		serviceFrom:String
    	}
    ],
    slack: {
        token: String
    },
    gmail: {
        token: String,
        expires: String,
        refreshToken: String,
        email: String
    },
    servicesSubscribed:[
        {
            type:String
        }
    ],
    github: {
        token: String,
        username: String,
        id: Number,
        isAppInstalled: Boolean
    },
    trello: {
        token: String,
        listName: String,
        cardTitle: String,
        position: String,
        boardID: String,
        description: String
    },
    servicesSubscribed: { type: [serviceSchema] },
    servicesNotSubscribed: { type: [String],
         default: ["Mail",
                    "Trello",
                    "Github",
                    "Facebook",
                    "Twitter",
                    "Instagram",
                    "Slack"]
    }   
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model("User", userSchema);
