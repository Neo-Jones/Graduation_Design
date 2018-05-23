const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')
const compress = require('koa-compress')

export default function middleware() {
	return convert.compose(
		logger(),
		bodyParser(),
		compress({
			filter: function (content_type) {
				if (/event-stream/i.test(content_type)) {
					// 为了让hot reload生效，不对__webpack_hmr压缩
					return false
				}
				return true
			},
		}),
	)
}
