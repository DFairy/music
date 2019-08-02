<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'
export default {
    props:{
        probeType: { //当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
            type: Number,
            default: 1
        },
        click: {//BetterScroll 默认会阻止浏览器的原生 click 事件。当设置为 true，BetterScroll 会派发一个 click 事件，
            type: Boolean,
            default: true
        },
         direction: {//方向
            type: String,
            default: DIRECTION_V
        },
        data: {
            type: Array,
            default: null
        },
    },
    mounted(){
        setTimeout(()=>{
            this.init()
        },20)
    },
    methods:{
        init(){
            if (!this.$refs.wrapper) {
                return
            }
             /* eslint-disable */
           let scroll = new BScroll(this.$refs.wrapper, {
               probeType: this.probeType,
               click: this.click,
               eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
            })
            scroll.on('beforeScrollStart', () => {
                console.log('scrolling is ready to bootstrap')
            })
            scroll.on('scrollStart', () => {
                console.log('scrollStart')
            })
            scroll.on('scroll', () => {
                console.log('scroll')
            })
        },
         refresh () {
            this.scroll && this.scroll.refresh()
        },
    },
    watch:{
        data(){
            setTimeout(()=>{
                this.refresh()
            },20)
        }
    }
}
</script>

<style lang='less' scoped>
</style>