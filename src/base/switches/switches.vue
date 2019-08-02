<template>
   <ul class="switches">
       <li class="switches-item" v-for="(item,index) in switches"
       :class="{'active':currentIndex === index}" :key="index"
        @click="switchItem(index)">
           <span>{{item.name}}</span>
       </li>
   </ul>
</template>

<script>
export default {
    props:{
        switches:{
            type:Array,
            default(){
                return []
            }
        },
        currentIndex:{
            type:Number,
            default:0
        }
    },
    methods:{
        switchItem (index) {
            this.$emit('switch', index)
        }
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.switches{
    .flex();
    width: 240px;
    margin: 0 auto;
    border-radius: 5px;
    .switches-item{
        flex:1;
        padding: 8px;
        text-align: center;
        font-size: @font-size-medium;
        &:first-child{ 
            border-right: 1px solid #ccc;
        }
        &.active{
            color: @color-green;
        }
    }
}
</style>