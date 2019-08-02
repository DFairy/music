<template>
   <div class="rank" ref="rank">
      <scroll class="toplist" ref="toplist" :data='topList'>
         <ul>
            <li class="item" v-for="(item,index) in topList" :key="index" @click='selectItem(item)'>
               <img v-lazy="item.picUrl" alt="" class="icon" width="100" height="100">
               <ul class="songlist">
                  <li class="song" v-for="(song,index) in item.songList" :key="index">
                     <span class="num">{{index + 1}}.</span>
                     <span>{{song.songname}}-{{song.singername}}</span>
                  </li>
               </ul>
            </li>
         </ul>
         <div class="loading-container" v-show="!topList.length">
            <loading></loading>
         </div>
      </scroll>
      <router-view></router-view>
   </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
   mixins: [playlistMixin],
   components:{
      Scroll,
      Loading
   },
   created () {
      this._getTopList()
    },
   data(){
      return{
         topList: []
      }
   },
   methods:{
      handlePlayList(playList){
         const bottom=playList.length>0?'60px':''
         this.$refs.rank.style.bottom=bottom
         this.$refs.toplist.refresh()
      },
      selectItem(item){
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      _getTopList () {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      ...mapMutations({
         setTopList: 'SET_TOP_LIST'
      })
   },

}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.rank{
   position: fixed;
   width: 100%;
   top: 88px;
   bottom: 0;
   .toplist{
      height: 100%;
      overflow: hidden;
      .item{
         .flex();
         margin: 0 20px;
         // padding-top:20px;
         height: 100px;
         margin-bottom: 20px;
         &:first-child{
            margin-top: 20px;
         }
         .icon{
            flex: 0 0 100px;
            width: 100px;
            height: 100px;
            border-radius: 5px;
            overflow: hidden;
         }
         .songlist{
            flex:1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 20px;
            height: 100px;
            overflow: hidden;
            font-size: @font-size-small;
            .song{
               .no-wrap();
               line-height: 26px;
               .num{
                  margin-right: 2px;
               }
            }
         }
      }
   }
   .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%)
   }  
}
</style>