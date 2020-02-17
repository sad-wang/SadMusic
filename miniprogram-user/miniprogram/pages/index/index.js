//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged: false,
    recommendLists:[],
    count:''
  },
  navTo:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  onLoad: function() {
    this.getKnownUserInfo()
    this.getRecommendLists()
    this.getUserFavoritesCount()
  },
  getKnownUserInfo:function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  getRecommendLists:function(){
    const db = wx.cloud.database()
    db.collection('recommend').get().then(function(res) {
      let result = res.data
      result.map((item)=>{
        let date = item.date
        date = date.getFullYear() + '-' + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' + date.getDate()
        item.date = date
        Object.assign(item,{count:item.songs.length})
      })
      this.setData({
        recommendLists: result
      })
    }.bind(this))
  },
  // aa:function(){
  //   db.collection('user').add({
  //     data: {
  //       favorites:["a8bafbad-5f36-442c-b7ec-d22f73ef8f9a"]
  //     },
  //     success: function(res) {
  //       console.log(res)
  //     }
  //   })
  // },
  getUserFavoritesCount:function(){
    db.collection('user').where({_openid: app.globalData.openid}).get().then(function(res){
      this.setData({
        count: res.data[0].favorites.length
      })
    }.bind(this))
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
})
