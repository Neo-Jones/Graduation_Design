module.exports = {
  app: {
    port: process.env.PORT || 8080,
    baseApi: '/api',
  },
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/vue-blog',
  },
  jwt: {
    secret: 'xsy', // 默认
  },
  mongodbSecret: { // mongodb用户和密码
    user: '',
    pass: '',
  },
  admin: { // 后台初始化的用户名密码
    user: 'admin',
    pwd: 'admin',
  },
  disqus: { // disqus
    url: '',
  },
  baidu: { // 百度统计
    url: '',
  }
}
