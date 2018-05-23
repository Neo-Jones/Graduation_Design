const Article = require('../models/article.js')

export async function createArticle(ctx) {
	// 初始化模型对象
	const title = ctx.request.body.title
	const content = ctx.request.body.content
	const abstract = ctx.request.body.abstract
	const tags = ctx.request.body.tags
	const publish = ctx.request.body.publish
	const createTime = new Date()
	const lastEditTime = new Date()

	if (title === '') {
		ctx.throw(400, '标题不能为空')
	}
	if (content === '') {
		ctx.throw(400, '文章内容不能为空')
	}
	if (abstract === '') {
		ctx.throw(400, '摘要不能为空')
	}
	const article = new Article({
		title,
		content,
		abstract,
		publish,
		tags,
		createTime,
		lastEditTime,
	})
	let createResult = await article.save().catch(() => {
		ctx.throw(500, '服务器内部错误')
	})
	await Article.populate(createResult, {
		path: 'tags'
	}, function (err, result) {
		createResult = result
		// console.log(result)
	})
	console.log('文章创建成功')
	ctx.body = {
		success: true,
		article: createResult,
	}
}

export async function getAllArticles(ctx) {
	const tag = ctx.query.tag
	const page = +ctx.query.page
	const limit = +ctx.query.limit || 4
	let skip = 0
	let articleArr
	let allPage
	let allNum

	if (page !== 0) {
		skip = limit * (page - 1)
	}

	if (tag === '') {
		articleArr = await Article.find()
			.populate('tags')
			.sort({
				createTime: -1
			})
			.limit(limit)
			.skip(skip).catch(() => {
				ctx.throw(500, '服务器内部错误')
			})
		allNum = await Article.count().catch(() => {
			this.throw(500, '服务器内部错误')
		})
	} else {
		let tagArr = tag.split(',')
		// console.log(tagArr)
		articleArr = await Article.find({
			tags: {
				$in: tagArr
			},
		})
			.populate('tags')
			.sort({
				createTime: -1
			})
			.limit(limit)
			.skip(skip).catch(() => {
				ctx.throw(500, '服务器内部错误')
			})
		allNum = await Article.find({
			tags: {
				$in: tagArr
			},
		}).count().catch(() => {
			ctx.throw(500, '服务器内部错误')
		})
	}
	allPage = Math.ceil(allNum / limit)
	ctx.body = {
		success: true,
		articleArr,
		allPage: allPage,
	}
}

export async function getAllPublishArticles(ctx) {
	const tag = ctx.query.tag
	const page = +ctx.query.page
	const limit = +ctx.query.limit || 4
	let skip = 0
	let articleArr
	let allPage
	let allNum

	if (page !== 0) {
		skip = limit * (page - 1)
	}

	if (tag === '') {
		articleArr = await Article.find({
			publish: true,
		})
			.populate('tags')
			.sort({
				createTime: -1
			})
			.limit(limit)
			.skip(skip).catch(() => {
				ctx.throw(500, '服务器内部错误')
			})
		allNum = await Article.find({
			publish: true,
		}).count().catch(() => {
			this.throw(500, '服务器内部错误')
		})
	} else {
		let tagArr = tag.split(',')
		// console.log(tagArr)
		articleArr = await Article.find({
			tags: {
				$in: tagArr
			},
			publish: true,
		})
			.populate('tags')
			.sort({
				createTime: -1
			})
			.limit(limit)
			.skip(skip).catch(() => {
				ctx.throw(500, '服务器内部错误')
			})
		allNum = await Article.find({
			tags: {
				$in: tagArr
			},
		}).count().catch(() => {
			ctx.throw(500, '服务器内部错误')
		})
	}
	allPage = Math.ceil(allNum / limit)
	ctx.body = {
		success: true,
		articleArr,
		allPage: allPage,
	}
}

export async function modifyArticle(ctx) {
	const id = ctx.params.id
	const title = ctx.request.body.title
	const content = ctx.request.body.content
	const abstract = ctx.request.body.abstract
	if (id === '') {
		ctx.throw(400, 'id不能为空')
	}

	if (title === '') {
		ctx.throw(400, '标题不能为空')
	}
	if (content === '') {
		ctx.throw(400, '文章内容不能为空')
	}
	if (abstract === '') {
		ctx.throw(400, '摘要不能为空')
	}

	const result = await Article.findByIdAndUpdate(ctx.params.id, {
		$set: ctx.request.body
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

export async function getArticle(ctx) {
	const id = ctx.params.id
	if (id === '') {
		ctx.throw(400, 'id不能为空')
	}

	const article = await Article.findById(id).catch(err => {
		if (err.name === 'CastError') {
			ctx.throw(400, 'id不存在')
		} else {
			ctx.throw(500, '服务器内部错误')
		}
	})
	ctx.body = {
		success: true,
		article: article,
	}
}

export async function deleteArticle(ctx) {
	const id = ctx.params.id
	const result = await Article.findByIdAndRemove(id).catch(err => {
		if (err.name === 'CastError') {
			this.throw(400, 'id不存在')
		} else {
			this.throw(500, '服务器内部错误')
		}
	})
	ctx.body = {
		success: true,
		result: result
	}
}

export async function publishArticle(ctx) {
	const id = ctx.params.id
	const result = await Article.findByIdAndUpdate(id, {
		$set: {
			publish: true
		}
	}).catch(err => {
		if (err.name === 'CastError') {
			this.throw(400, 'id不存在')
		} else {
			this.throw(500, '服务器内部错误')
		}
	})
	ctx.body = {
		success: true,
		result: result
	}
}

export async function notPublishArticle(ctx) {
	const id = ctx.params.id
	const result = await Article.findByIdAndUpdate(id, {
		$set: {
			publish: false
		}
	}).catch(err => {
		if (err.name === 'CastError') {
			this.throw(400, 'id不存在')
		} else {
			this.throw(500, '服务器内部错误')
		}
	})
	ctx.body = {
		success: true,
		result: result
	}
}
