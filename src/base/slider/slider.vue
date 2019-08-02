<template>
   <div class="banner-wrapper" v-if='recommend&&recommend.length>0'>
        <swiper :options="swiperOption" >
            <swiper-slide class="slide-item" v-for="(item, id) in recommend" :key="id" >
                <a :href="item.linkUrl">
                <img :src="item.picUrl" v-if='item.picUrl'>
                </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
   </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    props:{
        recommend:{
            type:Array,
            default(){
                return []
            }
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    data() {
      return {
        swiperOption: {
            loop:true,
            autoplay:true,
            pagination: {
                el: '.swiper-pagination',
                 clickable :true,
            }
        },
        recommends:[]
      }
    }
  }
</script>

<style lang='less' scoped>
@import "~common/style/variable";
.banner-wrapper{
    position: relative;
    height :180px;
    white-space :nowrap;
    .slide-item{
        display: inline-block;
        height:180px;
        width :100%;
        text-align: center;
        padding:10px;
        overflow: hidden;
        touch-action: none;
        a{
            display: block;
            width: 100%;
            height: 100%;
            text-decoration: none;
            overflow: hidden;
            border-radius: 10px;
            cursor: pointer;
            z-index:-1;
            img{
                width: 100%;
                height: 100%;
            }
        }       
    }
    .swiper-pagination{
        bottom: 14px; 
        /deep/.swiper-pagination-bullet{
            background: #eee;
            opacity: 1;;
        }
        /deep/ .swiper-pagination-bullet-active{
            width: 16px;
            border-radius :5px;
            background: @color-green!important
        } 
    }
    
}
</style>