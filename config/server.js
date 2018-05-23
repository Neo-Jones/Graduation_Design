import fs from 'fs';
let config = {
  app: {
    port: process.env.PORT || 8889,
    baseApi: '/api',
  },
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/vue-blog',
  },
  jwt: {
    secret: 'me', // 默认
  },
  mongodbSecret: { // mongodb用户和密码
    user: '',
    pass: '',
  },
  admin: { // 后台初始化的用户名密码
    user: 'admin',
    pwd: 'password',
  },
  disqus: { // disqus
    url: '',
  },
  baidu: { // 百度统计
    url: '',
  },
};

// 如果存在private.js,就使用private.js的配置
if (fs.existsSync(__dirname + '/private.js')) {
  config = Object.assign(config, require('./private.js'));
}

export default config;
