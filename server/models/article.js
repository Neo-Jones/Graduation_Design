// 利用mongoose对mongodb中的'文章'建模
const Mongoose = require('mongoose')
const Moment = require('moment')

Moment.locale('zh-cn')
const Schema = Mongoose.Schema
const articleSchema = new Schema({
	title: String, // 标题
	content: String, // 内容
	abstract: String, // 摘要
	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'tag'
	}], // 标签
	publish: {
		type: Boolean,
		default: false
	}, // 是否发布
	createTime: {
		type: Date
	},
	lastEditTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
})

articleSchema.set('toJSON', {
	getters: true,
	virtuals: true
})
articleSchema.set('toObject', {
	getters: true,
	virtuals: true
})
articleSchema
	.path('createTime')
	.get(v => Moment(v).format('lll'))
articleSchema
	.path('lastEditTime')
	.get(v => Moment(v).format('lll'))

module.exports = Mongoose.model('article', articleSchema)
