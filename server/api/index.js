const Router = require('koa-router')
const Convert = require('koa-convert')

const RequireDir = require('require-dir')

const config = require('../../config/server')

const routes = RequireDir('./routes')

export default function api() {
	const router = new Router({
		prefix: config.app.baseApi
	})
	Object.keys(routes).forEach(name => {
		return routes[name]['default'](router)
	})
	return Convert.compose([
		router.routes(),
		router.allowedMethods()
	])
}
