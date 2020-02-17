//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged: false,
    recommendLists:[],
    favoritesLists:[],
  },
  toFavorites:function() {
    wx.navigateTo({
      url: '../songList/songList',
      success: (res)=>{
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('songListData', {songData:this.data.favoritesLists,subtitle:this.data.userInfo.nickName,title:'Favorites'})
      }
    })
  },
  onLoad: function() {
    this.getKnownUserInfo()
    this.getRecommendLists()
    this.getUserFavoritesLists()
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
  getUserFavoritesLists:function(){
    db.collection('user').where({_openid: app.globalData.openid}).get().then((res)=>{
      this.setData({
        favoritesLists: res.data[0].favorites
      })
    })
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
