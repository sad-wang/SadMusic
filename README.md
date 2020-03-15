# SadMusic
![admin](https://user-gold-cdn.xitu.io/2020/3/15/170dba7792007f99?w=1445&h=783&f=png&s=1109883)
![wx-program](https://user-gold-cdn.xitu.io/2020/3/15/170dba89568c7b51?w=1242&h=2208&f=png&s=1854584)
这是一个开源的音乐播放器项目
## 技术栈
node.js + 七牛云 + leanCloud + 原生js + JQuery + 微信小程序 + 微信云开发

## 预览
pc 管理端
```git
git clone https://github.com/sad-wang/SadMusic.git

//自行配置 qiniu_key.json,属性为 accessKey 和 secretKey
//自行在 ./SadMusic/pc-admin/js/uploadLists.js 中配置 leancloudInit 函数中的 appId、appKey、serverURLs
cd SadMusic
//用于获取七牛 token
node server 9000
//用于预览 admin.html
cd pc-admin
http-server -c-1
```
## 未完待续
pc管理端准备放弃 七牛云 和 leanCloud，转向微信云开发后台。
