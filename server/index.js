const Koa = require('koa')
const Router = require('koa-router')
const Convert = require('koa-convert')
const Onerror = require('koa-onerror')
const Static = require('koa-static')
const mongoose = require('mongoose')
const {
	createBundleRenderer
} = ('vue-server-renderer')

const fs = require('fs')
const path = require('path')

const historyApiFallback = require('./middleware/historyApiFallback')
const config = require('../config/server')
const middleware = require('./middleware')
const api = require('./api')


const resolve = file => path.resolve(__dirname, file)

mongoose.Promise = Promise
// 连接 mongodb
mongoose.connect(config.mongodb.url, config.mongodbSecret)
mongoose.connection.on('error', console.error)

const isProd = process.env.NODE_ENV === 'production'
const router = new Router()
const routerInfo = new Router()
const app = new Koa()

// middleware
app.use(middleware())
Onerror(app)

// api/router
app.use(api())

// 加载静态文件
app.use(Static('../client/static'))

// 创建渲染器
let renderer

// 开启组件缓存
function createRenderer(bundle, template) {
	return createBundleRenderer(bundle, {
		template,
		cache: require('lru-cache')({
			max: 1000,
			maxAge: 1000 * 60 * 15,
		}),
		runInNewContext: false,
	})
}

// 提示信息
routerInfo.get('*', async (ctx, next) => {
	if (!renderer) {
		ctx.body = 'Waiting !!!'
		return ctx.body
	}
	return next()
})
app.use(routerInfo.routes())

// 在路由后台系统admin时直接走historyApiFallback,而不用服务器渲染
app.use(Convert(historyApiFallback({
	verbose: true,
	index: '/admin.html',
	rewrites: [{
		from: /^\/admin$/,
		to: '/admin.html',
	},
	{
		from: /^\/admin\/login/,
		to: '/admin.html',
	},
	],
	path: /^\/admin/,
})))

if (isProd) {
	// 生产环境下使用渲染器
	const bundle = require('../client/dist/vue-ssr-server-bundle.json')
	const template = fs.readFileSync(resolve('../client/dist/front.html'), 'utf-8')
	renderer = createRenderer(bundle, template)
	app.use(Static('./client/dist'))
} else {
	// 开发环境下使用hot/dev
	require('../client/build/setup-dev-server')(app, (bundle, template) => {
		renderer = createRenderer(bundle, template)
	})
}

// 流式渲染
router.get('*', async (ctx) => {
	const req = ctx.req
	ctx.type = 'html'
	const s = Date.now()
	const context = {
		title: 'Neo\'s blog',
		url: req.url,
		renderURLScript: (type) => {
			if (config[type].url !== '') {
				return `<script src="${config[type].url}" async></script>`
			}
			return ''
		},
	}

	function renderToStringPromise() {
		return new Promise((resolve, reject) => {
			renderer.renderToString(context, (err, html) => {
				if (err) {
					reject(err)
				}
				if (!isProd) {
					console.log(`whole request: ${Date.now() - s}ms`)
				}
				resolve(html)
			})
		})
	}
	ctx.body = await renderToStringPromise()
})

// 挂载路由
app
	.use(router.routes())
	.use(router.allowedMethods())


app.listen(config.app.port, () => {
	console.log(`Starting at http://localhost:${config.app.port}`)
})
export default app
