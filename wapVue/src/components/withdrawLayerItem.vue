<template>
    <dl class="item" v-if="listItem">
        <dt>{{listItem.createTime.replace(/-/g, '.')}}</dt>
        <dd>{{utils.currency(listItem.withdrawAmount)}} [{{listItem.bizStatus}}] <span :class="{'time' : listItem.bizStatus == '回退中'}">{{tips}}</span></dd>
    </dl>
</template>
<script>
export default {
    name: 'withdrawLayerItem',
    props : ['listItem'],
    data () {
        return {
            timer : null,
            time : 0,
            nowTime :0,
            endTime : 0,
            item : '',
            tips : ''
        }
    },
    created:function(){
        //var t = this.listItem.createTime.replace(/-/g,'/');
        // this.time = Date.parse(new Date(t)) + 1000*60*20;
        // this.nowTime = Date.parse(new Date());
        // this.endTime = (this.time - this.nowTime)/1000;
        this.tips = this.listItem.desc;
        if(this.listItem.desc *1 > 0){
            this.endTime = this.listItem.desc*1;
            this.countDown();
        }else if(this.listItem.desc *1 <= 0){
            this.endTime = 0
            this.tips = '即将退回到账户余额'
        }else{
            this.endTime = 0
        }

    },
    methods:{
        countDown(){
            var _this = this;
            this.timer = setInterval(function(){
                _this.endTime--;
                if(_this.endTime <= 0){
                    _this.tips = '即将退回到账户余额'
                    window.clearInterval(this.timer)
                }else{
                    var fen = parseInt(_this.endTime/60) > 9 ? parseInt(_this.endTime/60) : '0'+parseInt(_this.endTime/60),
                        miao = _this.endTime%60 > 9 ? _this.endTime%60 : '0'+(_this.endTime%60);
                    _this.tips = '预计 00:'+fen+':'+ miao +'内退回到账户余额'
                }
            },1000)
        }
    }
}
</script>
<style scoped="">
dl.item{padding:.5rem 0;line-height:1.1875rem;color:#2B313D;border-bottom:1px solid #DFE3EB;height:auto;overflow:hidden;}
dl.item dt{float:left;width:4rem;}
dl.item dd{float:right;width:11rem; text-align:right;font-weight: 600;}
dl.item dd span{display:block;color:#848999;font-weight: normal;}
dl.item dd span.time{color:#F48A12}
</style>
