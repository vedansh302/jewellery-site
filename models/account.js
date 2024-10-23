const mongoose = require('mongoose')

function validatePassword(value){
    return value === this.Register_password;
}
// validation for mongoose database
const registerSchema = new mongoose.Schema({
    username :{
        type:String,
        required:true,
        
    },
    Register_email:{
        type:String,
        required:true,
        unique: true
    },
    Register_password:{
        type:String,
        required:true
    },
    conf_password:{
        type:String,
        required:true,
        validate:[validatePassword ,"Password and confirm password must match with eachOther"]  
    }
})

const registerForm = mongoose.model('regitration',registerSchema);
module.exports = registerForm