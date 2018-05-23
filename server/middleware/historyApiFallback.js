function historyApiFallback(options) {
	const expressMiddleware = require('connect-history-api-fallback')(options)
	const url = require('url')
	return (ctx, next) => {
		const parseUrl = url.parse(ctx.req.url)
		if (!parseUrl.pathname.match(options.path)) {
			return next()
		}
		ctx.type = 'html'
		return expressMiddleware(ctx.req, ctx.res, next)
	}
}

module.exports = historyApiFallback
