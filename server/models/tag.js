const Mongoose = require('mongoose')

const Schema = Mongoose.Schema
const tagSchema = new Schema({
	name: {
		type: String,
		default: ''
	}
}, {
	versionKey: false
})

tagSchema.set('toJSON', {
	getters: true,
	virtuals: true
})
tagSchema.set('toObject', {
	getters: true,
	virtuals: true
})

module.exports = Mongoose.model('tag', tagSchema)
