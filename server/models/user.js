import Mongoose from 'mongoose'

const Schema = Mongoose.Schema
const userSchema = new Schema({
	name: String,
	username: String,
	password: String,
	avatar: String,
	createTime: String
}, {
	versionKey: false
})

module.exports = Mongoose.model('user', userSchema)
