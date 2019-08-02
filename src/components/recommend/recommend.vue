<template>
   <div class="recommend" ref='recommend'>
       <Scroll class="scroll-wrapper" :data='discList' ref='slider'>
           <div>
              <Slider :recommend='recommends'></Slider>
              <div class="recommend-list">
                <h1 class="title">热门歌单推荐</h1>
                <ul class="disc">
                   <li @click="selectItem(item)" v-for="(item,index) in discList"  :key="index">
                    <img v-lazy="item.imgurl" class="icon" alt="">
                    <div class="text">
                      <p class="name">{{item.creator.name}}</p>
                      <p class="desc">{{item.dissname}}</p>
                    </div>
                  </li>
                </ul>
              </div>
           </div>
           <div class="loading-container" v-show="!discList.length">
            <Loading></Loading>
          </div>
       </Scroll>
       <router-view></router-view>
   </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import { ERR_OK } from 'api/config'
import { getRecommend, getDiscList} from 'api/recommend'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
    mixins: [playlistMixin],
    components:{
      Scroll,
      Slider,
      Loading
    },
    data() {
      return {
        recommends:[],
        discList:[]
      }
    },
    created(){
        this._getRecommend()
        this._getDiscList()
    },
    methods:{
        handlePlayList(playList){
          const bottom=playList.length>0?'60px':''
          this.$refs.recommend.style.bottom=bottom
          this.$refs.slider.refresh()
        },
        selectItem (item) {
          this.$router.push({
            path: `/recommend/${item.dissid}`
          })
          this.setDisc(item)
        },
        _getRecommend () {
            getRecommend().then((res) => {
                if (res.code === ERR_OK) {
                this.recommends = res.data.slider
                }
            })
        },
        _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      ...mapMutations({
        setDisc:'SET_DISC'
      })
    }
  }
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";

.recommend{
    position: fixed;
    width: 100%;
    bottom: 0;
    top: 94px;
    .scroll-wrapper{
        height: 100%;
        overflow: hidden;
        .recommend-list{
          .title{
            text-align: center;
            height: 50px;
            line-height: 50px;
            color: @color-green;
            font-size: @font-size-medium
          }
          .disc{
            li{
              .flex(flex-start);
              padding: 0 20px 20px 20px;
              box-sizing: border-box;
              height: 80px;
              .icon{
                width: 60px;
                // flex: 0 0 60px;
                margin-right: 20px;
                border-radius: 5px;
                overflow: hidden;
              }
              .text{
                flex:1;
                line-height: 20px;
                overflow: hidden;
                font-size: @font-size-medium;
                .name{
                  margin-bottom: 10px;
                }
                .desc{
                  color: @color-grey;
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
}
</style>