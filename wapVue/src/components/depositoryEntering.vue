<template>
    <div class="layerMask" v-if="entering">
        <div ref="enteringBox" class="depositoryEntering"></div>
    </div>
</template>
<script>
export default {
    name: 'depositoryEntering',
    data () {
        return {
            entering : false,
        }
    },
    created:function(){

    },
    mounted:function(){

    },
    methods:{
        show(){
            this.entering = true;
            var _this = this;
            setTimeout(()=>{
                lottie.loadAnimation({
                    container: _this.$refs.enteringBox, // the dom element that will contain the animation
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: '/static/js/depositoryLoading.json' // the path to the animation json
                });
            },300)
        },
        close(){
            this.entering = false;
        }
    }
}
</script>
<style scoped>
.depositoryEntering{width:13.8125rem;height:12rem;padding:1rem;padding-bottom:0;padding-top:3rem; position: absolute;left:50%;margin-left:-7.90625rem;top:50%;margin-top:-7.5rem;z-index:101;background:url("//static.facebank.cn/static/wapFront/depository/img/loadingTk.png") no-repeat center center/100% 100%;}
</style>
