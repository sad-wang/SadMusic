// components/songLists.js
const db = wx.cloud.database()
Component({
  properties: {
    songListsData:{
      type:Object
    }
  },
  data: {
    title:'',
    subtitle:'',
    songData:[],
    songLists:[]
  },
  attached: function() {
    this.setData({
      title:this.data.songListsData.title,
      subtitle:this.data.songListsData.subtitle,
      songData:this.data.songListsData.songData
    })
    this.getSongLists()
  },
  methods:{
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
    playingSongs:function(e){
      let detail={
        index:e.currentTarget.dataset.index,
        songLists:JSON.parse(JSON.stringify(this.data.songLists))
      }
      this.triggerEvent('playing', detail, {capturePhase:true,bubbles: true, composed: true})
    },
    backToIndex:function () {
      this.triggerEvent('backToIndex', {}, {capturePhase:true,bubbles: true, composed: true})
    }
  }
})
