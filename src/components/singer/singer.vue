<template>
   <div class="singer" ref='singer'>
      <ListView :data='singers' @select='selectItem' ref='list'></ListView>
      <router-view></router-view>
   </div>
</template>

<script>
import ListView from 'base/listview/listview'
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import {mapMutations} from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
export default {
   mixins: [playlistMixin],
   components: {
      ListView
    },
   data(){
      return{
         singers:[]
      }
   },
   created(){
      this._getSingerList()
   },
   methods:{
      handlePlayList(playList){
         const bottom=playList.length>0?'60px':''
         this.$refs.singer.style.bottom=bottom
         this.$refs.list.refresh()
      },
      selectItem(item){
         this.$router.push({
          path: `/singer/${item.id}`
        })
        this.setSinger(item)
      },
      _getSingerList () {
        getSingerList().then((res) => {

          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list){
         let map={
            hot:{
               title:HOT_NAME,
               items:[]
            }
         }
         list.forEach((item,index)=>{
            if (index < HOT_SINGER_LEN) {
               map.hot.items.push(new Singer({
                  name:item.Fsinger_name,
                  id: item.Fsinger_mid
               }))
            }
            const key=item.Findex
            if(!map[key]){
               map[key]={
                  title:key,
                  items:[]
               }
            }
             map[key].items.push(new Singer({
               name:item.Fsinger_name,
               id: item.Fsinger_mid
            }))
         })
         //给map排序
         let ret = []
         let hot = []
         for(let key in map){
            let val=map[key]
            if(val.title.match(/[a-zA-Z]/)){
               ret.push(val)
            }else if (val.title === HOT_NAME) {
               hot.push(val)
            }
         }
         ret.sort((a,b)=>{
            return a.title.charCodeAt(0)-b.title.charCodeAt(0)
         })
         return hot.concat(ret)
      },
      ...mapMutations({
         setSinger:'SET_SINGER'
      })
   }
}
</script>

<style lang='less' scoped>
.singer{
   position: fixed;
   top: 96px;
   bottom: 0;
   width: 100%;
}
</style>