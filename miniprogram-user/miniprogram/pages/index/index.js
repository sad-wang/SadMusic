//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    indexShow:true,
    songListsShow:false,
    playingShow:false,
    bottomBarShow:true,

    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged: false,

    recommendLists:[],
    favoritesLists:[],
    songListsData:{},

    detail:{}
  },
  toFavorites:function() {
    this.setData({
      songListsData: {
        songData:this.data.favoritesLists,
        subtitle:this.data.userInfo.nickName,
        title:'Favorites'},
      indexShow:false,
      songListsShow:true,
    })
  },
  toRecommend:function(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      songListsData: {
        songData:this.data.recommendLists[index].songs,
        subtitle:this.data.recommendLists[index].keywords,
        title:this.data.recommendLists[index].date
      },
      indexShow:false,
      songListsShow:true
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
    db.collection('recommend').get().then((res)=>{
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
    })
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
  updatePlaying:function (e) {
    this.setData({
      detail: e.detail
    })
  },
  backToIndex:function () {
    this.setData({
      indexShow:true,
      songListsShow:false,
    })
  }
})
