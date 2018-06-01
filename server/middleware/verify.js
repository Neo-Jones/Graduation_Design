import jwt from 'jsonwebtoken'

import config from '../../config/server.js'

export default async (ctx, next) => {
  const authorization = ctx.get('Authorization')
  if (authorization === '') {
    ctx.throw(401, 'Need http header : Authorization')
  }
  const token = authorization.split(' ')[1]
  let tokenContent
  try {
    tokenContent = await jwt.verify(token, config.jwt.secret)
    console.log("tokenContent:" + tokenContent)
  } catch (err) {
    // 错误有"TokenExpiredError"和"jsonWebTokenError"
    let errorString = '错误类型:' + err.name + '错误信息:' + err.message
    ctx.throw(401, errorString)
  }
  console.log('token鉴权成功')
  await next()
}
