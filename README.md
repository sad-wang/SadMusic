# SadMusic
![pc端](https://user-gold-cdn.xitu.io/2020/3/15/170dba7792007f99?w=1445&h=783&f=png&s=1109883)
![IMG_0507.png](https://user-gold-cdn.xitu.io/2020/3/15/170dbbc28506e74d?w=311&h=552&f=png&s=50937)
![小程序端](https://user-gold-cdn.xitu.io/2020/3/15/170dbbadc12ac0b1?w=311&h=552&f=png&s=128409)

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
小程序端
体验版成员有限，暂不提供预览码，可自行克隆仓库通过微信开发平台预览。
## 未完待续
pc管理端准备放弃 七牛云 和 leanCloud，转向微信云开发后台。
