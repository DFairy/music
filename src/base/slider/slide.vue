<template>
    <div class="banner-wrapper" >
      <div class="slide-banner-scroll" ref="slide">
        <div class="slide-banner-wrapper" >
            <!-- <div class="slide-item" >
                <a style="background-image:url('/img/StockSnap_LQIWCHE1WD.d89d4caf.jpg')">
                </a>
            </div> -->
          <div class="slide-item" v-for="(item, id) in recommends"
          :key="id" v-if='recommends'>
              <a :href="item.linkUrl"  >
              <img :src="item.picUrl" v-if='item.picUrl' @load="loadImage" >
              </a>
          </div>
        </div>
      </div>
      <div class="docs-wrapper">
        <span
          class="doc"
          v-for="(item, index) in dots"
          :key="index"
          :class="{'active': currentPageIndex === index}"></span>
      </div>
    </div>
</template>


<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { ERR_OK } from 'api/config'
import { getRecommend } from 'api/recommend'
BScroll.use(Slide)

export default {
    // props:{
    //     recommends:{
    //         type: Array,
    //         default () {
    //             return []
    //         }
    //     }
    // },
    data() {
        return {
        slide: null,
        currentPageIndex: 0,
        playTimer: 0,
        dots:[],
        recommends:[]
        }
    },
    mounted() {
            this._getRecommend()
            this._initDots()
        this.init()
        

    },
    beforeDestroy() {
        clearTimeout(this.playTimer)
        this.slide.destroy()
    },
    methods: {
        init() {
        clearTimeout(this.playTimer)
        this.slide = new BScroll(this.$refs.slide, {
            scrollX: true,
            scrollY: false,
            slide: {
            loop: true,
            threshold: 100
            },
            useTransition: true,
            momentum: false,
            bounce: false,
            stopPropagation: true,
            probeType:2
        })
        this.slide.on('scrollEnd', this._onScrollEnd)

        // user touches the slide area
        this.slide.on('beforeScrollStart', () => {
            clearTimeout(this.playTimer)
        })
        // user touched the slide done
        this.slide.on('scrollEnd', () => {
            this.autoGoNext()
        })
        this.slide.on('slideWillChange', (page) => {
            this.currentPageIndex = page.pageX
        })
        this.autoGoNext()
        },
        _onScrollEnd() {
        this.autoGoNext()
        },
        autoGoNext() {
        clearTimeout(this.playTimer)
        this.playTimer = setTimeout(() => {
            this.slide.next()
        }, 4000)
        },
        _initDots () {
        // console.log(this.$refs.dot.children)
        console.log(this.recommends)
        
        },
        _getRecommend () {
        getRecommend().then((res) => {
         
            if (res.code === ERR_OK) {
            
            this.recommends = res.data.slider
            this.dots = this.recommends.length
                console.log( this.recommends )
            }
        })
        },
        loadImage () {
          if (!this.loaded) {
            this.loaded = true
            setTimeout(() => {
              this.init()
            }, 20)
          }
        },
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";

.banner-wrapper{
    position :relative;
    .slide-banner-scroll{
        min-height :1px;
        overflow :hidden;
        .slide-banner-wrapper{
            height :200px;
            white-space :nowrap;
            font-size: 0;
            .slide-item{
                display: inline-block;
                height:200px;
                width :100%;
                text-align: center;
                padding:10px;
                overflow: hidden;
                white-space: nowrap;
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
       } 
    }
    .docs-wrapper{
        position :absolute;
        bottom: 14px;
        left :50%;
        transform :translateX(-50%);
        .doc{
            display :inline-block;
            margin: 0 4px;
            width: 6px;
            height :6px;
            border-radius: 50%;
            background :#eee;
            &.active{
                width :16px;
                border-radius :5px;
                background: @color-green!important
            } 
        }
    }
}

</style>