const Tag = require('../models/tag.js')
const Article = require('../models/article')

export async function createTag(ctx) {
	const tagName = ctx.request.body.name
	if (tagName === '') {
		ctx.throw(400, '标签名不能为空')
	}
	const tag = await Tag.findOne({
		name: tagName
	}).catch(() => {
		ctx.throw(500, '服务器错误')
	})
	if (tag !== null) {
		ctx.body = {
			success: true,
			tag: tag,
		}
		return
	}
	const newTag = new Tag({
		name: tagName,
	})
	const result = await newTag.save().catch(() => {
		ctx.throw(500, '服务器错误')
	})
	ctx.body = {
		success: true,
		tag: result
	}
}

export async function getAllTags(ctx) {
	const tagArr = await Tag.find().catch(() => {
		ctx.throw(500, '服务器内部错误')
	})
	ctx.body = {
		success: true,
		tagArr: tagArr
	}
}

export async function modifyTag(ctx) {
	const id = ctx.params.id
	const name = ctx.request.body.name
	if (name === '') {
		ctx.throw(400, '标签名不能为空')
	}
	const result = await Article.findByIdAndUpdate(id, {
		$set: {
			name: name
		}
	}).catch(err => {
		if (err.name === 'CastError') {
			ctx.throw(400, 'id不存在')
		} else {
			ctx.throw(500, '服务器内部错误')
		}
	})
	ctx.body = {
		success: true,
		result: result
	}
}

export async function deleteTag(ctx) {
	const id = ctx.params.id
	const result = await Tag.findByIdAndRemove(id).catch(err => {
		if (err.name === 'CastError') {
			ctx.throw(400, 'id不存在')
		} else {
			ctx.throw(500, '服务器内部错误')
		}
	})
	ctx.body = {
		success: true,
		result: result
	}
}
