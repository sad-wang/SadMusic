// miniprogram/pages/songList.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    title:'',
    subtitle:'',
    songData:[],
    songLists:[],
  },
  onLoad: function (options) {
    let eventChannel = this.getOpenerEventChannel();
    eventChannel.on('songListData', (data)=>{
      this.setData({
        ...data
      })
      this.getSongLists()
    })
  },
  getSongLists:function(){
    this.data.songData.map((songs)=>{
        db.collection('song_list').where({_id:songs}).get().then((res)=>{
          let songData = JSON.parse(JSON.stringify(this.data.songLists))
          songData.push(res.data[0])
          this.setData({
            songLists: songData
          })
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
})