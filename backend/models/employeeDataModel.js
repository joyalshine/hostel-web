const bcrypt = require('bcrypt')
const mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectId;

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    empid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneno: {
        type: Number,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
    },
    accessRights : {
        type:Array
    }
}, { timestamps: true });


// EmployeeSchema.pre('save', async function (next) {
//     const salt = await bcrypt.genSalt()
//     this.password = await bcrypt.hash('1234', salt)
//     next()
// })

EmployeeSchema.statics.loginUser = async function (empid, password) {
    const doc = await this.findOne({ empid: empid })
    console.log(doc)
    console.log(empid)
    if (doc) {
        const passwordMatch = await bcrypt.compare(password, doc.password)
        if (passwordMatch) {
            return doc;
        }
        throw Error('incpass')
    }
    throw Error('notfound')
}

EmployeeSchema.statics.validateCredentials = async function (empid, email) {
    const doc = await this.findOne({ empid: empid })
    if (doc) {
        const emailMatch = doc.email == email 
        if (emailMatch) {
            return {id : doc._id,name : doc.name};
        }
        throw Error('inccred')
    }
    throw Error('notfound')
}

EmployeeSchema.statics.resetPassword = async function (id, password) {
    const salt = await bcrypt.genSalt()
    const encryptedPass = await bcrypt.hash(password, salt)
    const doc = await this.findOneAndUpdate({ _id: new ObjectId(id) },{password : encryptedPass})
    return;
}

const Employee = mongoose.model("employee", EmployeeSchema);

module.exports = Employee;