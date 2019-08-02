<template>
   <div class="my">
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div class="play-wrapper">
            <div ref="playBtn"  class="play" @click="random">
               <img src="../../common/image/play-mini.png" class="icon-play" alt="">
               <span class="text">随机播放全部</span>
            </div>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
   </div>
</template>

<script>
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import NoResult from 'base/no-result/no-result'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
export default {
   components:{
      Switches,
      Scroll,
      SongList,
      NoResult
   },
   mixins:[playlistMixin],
   data(){
      return{
         currentIndex:0,
         switches:[
            {
               name:'我喜欢的'
            },
            {
               name:'最近听的'
            }
         ]
      }
   },
   computed:{
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ]),
      noResult () {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      },
      noResultDesc () {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过歌曲'
        }
      },
   },
   methods:{
      handlePlayList (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      switchItem(index){
         this.currentIndex=index
      },
      selectSong (song) {
        this.insertSong(song)
      },
      random () {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if (list.length === 0) {
          return
        }
        this.randomPlay({
          list
        })
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
   }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.my{
   position: fixed;
    width: 100%;
    bottom: 0;
    top: 94px;
    .play-wrapper{
            margin: 20px auto;
            .play{
                box-sizing: border-box;
                width: 135px;
                padding: 7px 0;
                margin: 0 auto;
                text-align: center;
                border: 1px solid @color-green;
                color: @color-green;
                 border-radius: 100px;
                font-size: 0;
                .icon-play{
                    display: inline-block;
                    vertical-align: middle;
                    width: 24px;
                    height: 24px;
                    margin-right: 6px;
                    font-size: @font-size-medium-x ;
                }
                .text{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: @font-size-small;
                }
            }
      }
      .list-wrapper{
         position: absolute;
         top: 90px;
         bottom: 0;
         width: 100%;
         .list-scroll{
            height: 100%;
            overflow: hidden;
            .list-inner{
               padding: 20px 30px;
            }
         }
      }
      .no-result-wrapper{
         position: absolute;
         width: 100%;
         top: 50%;
         transform: translateY(-50%);
      }
}
</style>