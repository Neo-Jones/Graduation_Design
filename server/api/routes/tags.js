const $ = require('../../controllers/tags_controller.js')
const verify = require('../../middleware/verify.js')

export default async (router) => {
	router.post('/tags', verify, $.createTag)
		.get('/tags', $.getAllTags)
		.patch('/tags/:id', verify, $.modifyTag)
		.delete('/tags/:id', verify, $.deleteTag)
}
