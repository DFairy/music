<template>
   <div class="progress-bar" ref="progressBar" @click='progressClick'>
       <div class="inner">
           <div class="progress" ref='progress'></div>
           <div class="progress-btn-wrapper" ref="progressBtn">
               <div class="progress-btn"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd"></div>
           </div>
       </div>
   </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
    props:{
        percent:{
            type:Number,
            default:0
        }
    },
    created () {
      this.touch = {}
    },
    methods:{
        progressTouchStart(e){
            this.touch.initiated = true
            this.touch.startX=e.touches[0].pageX
            this.touch.left = this.$refs.progress.clientWidth
        },
        progressTouchMove(e){
            if (!this.touch.initiated) {
                return
            }
            const deltaX = e.touches[0].pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
            this._offset(offsetWidth)
            this.$emit('percentChanging', this._getPercent())
        },
        progressTouchEnd(){
            this.touch.initiated = false
            this._triggerPercent()
        },
        progressClick(e){
            const rect=this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth=e.pageX-rect.left
            this._offset(offsetWidth)
            this._triggerPercent()
        },
        _offset(offsetWidth){
            this.$refs.progress.style.width=`${offsetWidth}px`
            this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`
        },
        _getPercent(){
            const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
            return this.$refs.progress.clientWidth/barWidth
        },
        _triggerPercent () {
            this.$emit('percentChange', this._getPercent())
        },
        setProgressOffset(percent){
            if(percent>=0 && !this.touch.initiated){
                const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
                const offsetWidth = percent * barWidth
                this._offset(offsetWidth)
            }
        }
    },
    watch:{
        percent(newVal){
            this.setProgressOffset(newVal)
        }
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
.progress-bar{
    height: 30px;
    .inner{
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, 0.3);
        .progress{
            position: absolute;
            height: 100%;
            background: @color-green;
        }
        .progress-btn-wrapper{
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;
            .progress-btn{
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid #fff;
                border-radius: 50%;
                background: @color-green;
            }
        }
    }
}
</style>