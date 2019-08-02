<template>
<transition name="list-fade"  >
   <div  class="playlist" v-show="showFlag" @click="hide">
       <div class="list-wrapper" @click.stop>
           <div class="list-header">
                <h1 class="title">
                    <img :src="iconMode" @click='changeMode' alt="">
                    <div class="text" v-html='modeText'></div>
                    <img src="../../common/image/delete.png" @click="showConfirm" alt=""> 
                </h1>
           </div>
           <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
                <transition-group ref="list" name="list" tag="ul">
                   <li   class="item" v-for="(item,index) in sequenceList" :key="item.id"
                   @click="selectItem(item,index)">
                       <img :src="getCurrentIcon(item)" class="current"  alt="">
                       <div class="text" v-html="item.name"></div>
                       <img :src="getFavoriteIcon(item)" @click.stop="toggleFavorite(item)" class="like" alt="">
                       <img src="../../common/image/del-icon.png" @click.stop="deleteOne(item)" class="delete" alt="">
                   </li>
               </transition-group>
           </scroll>
           <div class="list-operate">
               <div class="add" @click="addSong">
                   +添加歌曲到队列
               </div>
           </div>
           <div class="list-close" @click="hide">
               <span>关闭</span>
           </div>
           <add-song ref="addSong"></add-song>
           <confirm ref="confirm" @confirm="confirmClear"  text="是否清空播放列表" confirmBtnText="清空"></confirm>
       </div>
   </div>
</transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/add-song/add-song'
import { playMode } from 'common/js/config'
import { mapActions} from 'vuex'
import {playerMixin} from 'common/js/mixin'

export default {
    mixins:[playerMixin],
    components:{
        Scroll,
        Confirm,
        AddSong
    },
    data(){
        return{
            showFlag: false,
            refreshDelay: 120
        }
    },
    computed:{
        modeText () {
            return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
        },
    },
    methods:{
        show(){
            this.showFlag=true
            setTimeout(()=>{
                this.$refs.listContent.refresh()
                this.scrollToCurrent(this.currentSong)
            },20)
        },
        hide(){
            this.showFlag=false
        },
        getCurrentIcon(item){
            if(this.currentSong.id===item.id){
                return require('../../common/image/play.png')
            }
            return ''
        },
        selectItem(item,index){
            if(this.mode===playMode.random){
                index=this.playList.findIndex((song)=>{
                    return song.id=item.id
                })
            }
            this.setCurrentIndex(index)
            this.setPlayingState(true)
        },
        scrollToCurrent (current) {
            const index = this.sequenceList.findIndex((song) => {
                return current.id === song.id
            })
            this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
        },
        deleteOne(item){
            if (item.deleting) {
                return
            }
            item.deleting = true
            this.deleteSong(item)
            if (!this.playList.length) {
                this.hide()
            }
            setTimeout(() => {
                item.deleting = false
            }, 300)
        },
        showConfirm(){
             this.$refs.confirm.show()
        },
        confirmClear(){
            this.deleteSongList()
            this.hide()
        },
        addSong(){
            this.$refs.addSong.show()
        },
        ...mapActions([
            'deleteSong',
            'deleteSongList'
        ])
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        setTimeout(() => {
          this.scrollToCurrent(newSong)
        }, 20)
      }
    },
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.playlist{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: @color-background-d;
    &.list-fade-enter-active,&.list-fade-leave-active{
        transition: opacity 0.3s;
        .list-wrapper{
            transition: all 0.3s
        }
    }
    &.list-fade-enter,&.list-fade-leave-to{
        opacity: 0;
        .list-wrapper{
            transform: translate3d(0,100%,0)
        }
    }
    .list-wrapper{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: @color-text;
        .list-header{
            position: relative;
            padding: 20px 30px 10px 20px;
            .title{
                .flex();
                img{
                    flex:0 0 20px;
                    width: 20px;
                }
                .text{
                    flex:1;
                    font-size: @font-size-medium;
                    color: @color-text-d;
                    margin: 0 10px;
                }
            }
        }
        .list-content{
            max-height: 240px;
            overflow: hidden;
            .item{
                .flex();
                height: 40px;
                padding: 0 30px 0 20px;
                overflow: hidden;
                &.list-enter-active,&.list-leave-active{
                    transition: all 0.1s;
                }
                &.list-enter,&.listleave-to{
                    height: 0;
                }
                img{
                    flex: 0 0 20px;
                    width:20px;
                }
                .current{
                    margin-right: 10px;
                    width: 15px;
                    flex: 0 0 15px;
                }
                .text{
                    flex: 1;
                    font-size: @font-size-medium;
                    color: @color-text-d;
                    .no-wrap();
                }
                .like{
                    margin-right: 15px;
                }

            }
        }
        .list-operate{
            width: 140px;
            margin: 20px auto 30px auto;
            .add{
                .flex();
                padding: 8px 16px;
                border: 1px solid @color-text-l;
                border-radius: 100px;
                color: @color-text-l;
                 font-size: @font-size-small
            }
        }
        .list-close{
            text-align: center;
            line-height: 50px;
            background: #222;
            font-size: @font-size-medium-x;
            color: @color-text-l;
        }
    }
}
</style>