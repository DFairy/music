<template>
   <div class="song-list">
       <ul>
           <li @click='selectSong(song,index)' class="item" v-for="(song, index) in songs" :key='index'>
               <div class="rank" v-show="rank">
                   <span :class="getRankCla(index)" v-text="getRankText(index)"></span>
               </div>
               <div class="content">
                   <h2 class="name">{{song.name}}</h2>
                   <p class="desc">{{getDesc(song)}}</p>
               </div>
           </li>
       </ul>
   </div>
</template>

<script>
export default {
    props:{
        songs:{
            type:Array,
            default(){
                return []
            }
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    methods:{
        getDesc (song) {
            return `${song.singer}·${song.album}`
        },
        selectSong(song,index){
            this.$emit('select',song,index)
        },
        getRankCla(index){
            if(index<=2){
                return `icon icon${index}`
            }else{
                return 'text'
            }
        },
        getRankText(index){
            if(index>2){
                return index+1
            }
        }
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.song-list{
    .item{
        .flex();
        box-sizing: border-box;
        height: 64px;
        font-size: @font-size-medium;
        .rank{
            flex: 0 0 25px;
            width: 25px;
            margin-right: 30px;
            text-align: center;
            .icon{
                width: 25px;
                height: 25px;
                background-size: 25px 25px;
                display: inline-block;
                &.icon0{
                    background-image: url('../../common/image/1.png');
                }
                &.icon1{
                    background-image: url('../../common/image/2.png')
                }
                &.icon2{
                    background-image: url('../../common/image/3.png')
                }
            }
            .text{
                color: @color-green;
                font-size: @font-size-large;
                font-style: italic;
            }
        }
        .content{
            flex:1;
            line-height: 20px;
            overflow: hidden;
            .name{
                .no-wrap();
                color: @color-text;
                font-size: @font-size-medium
            }
            .desc{
               .no-wrap();
               margin-top: 4px;
               color: @color-grey; 
               font-size: @font-size-small;
            }
        }
    }
}
</style>