import Router from 'koa-router'
import Convert from 'koa-convert'

import RequireDir from 'require-dir'

import config from '../../config/server.js'

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
