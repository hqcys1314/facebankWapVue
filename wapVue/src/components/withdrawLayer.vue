<template>
    <div class="layerMask" v-show="showLayer">
        <div class="layer_style" style="top:20%;overflow:visible" v-cloak>
            <img src="//static.facebank.cn/static/wapFront/depository/img/shenhe.png" class="shenhe" />
            <div class="withdrawMoney">您当前有{{utils.currency(drawCashFrozenCash)}}元申请提现</div>
            <dl class="title"><dt>申请时间</dt><dd>提现金额(元)</dd></dl>
            <div class="list">

                <!-- <dl class="item">
                    <dt>{{item.createTime.replace(/-/g, '.')}}</dt>
                    <dd>{{item.withdrawAmount}} [{{item.bizStatus}}] <span>{{item.desc}}</span></dd>
                </dl> -->
                <withdrawItem v-for="t in listItem" :key="t.createTime" :listItem="t"></withdrawItem>
                <!-- <dl class="item">
                    <dt>2019.04.29<br>13:00:29</dt>
                    <dd>100000.89 [银行审核中] <span>预计4月16日18:00前到帐</span></dd>
                </dl>
                <dl class="item">
                    <dt>2019.04.29<br>13:00:29</dt>
                    <dd>100000.89 [银行审核中] <span class="time">预计4月16日18:00前到帐</span></dd>
                </dl>
                <dl class="item">
                    <dt>2019.04.29<br>13:00:29</dt>
                    <dd>100000.89 [银行审核中] <span>预计4月16日18:00前到帐</span></dd>
                </dl> -->
            </div>
            <div class="desc">进入银行存管系统后，如果提现中断，资金将会在 20分钟内退回到账户余额！</div>
            <div class="layer_btn one">
                <a @click="close()" class="jh-btn" jh-name="关闭提现申请弹窗">我知道了</a>
            </div>
        </div>
    </div>
</template>
<script>
import withdrawItem from '@/components/withdrawLayerItem'
export default {
    name: 'withdrawLayer',
    props : ['listItem', 'drawCashFrozenCash', 'from'],
    components: {withdrawItem},
    data () {
        return {
            showLayer : false,
        }
    },
    created:function(){
        if(this.drawCashFrozenCash*1 > 0){
            this.show();
        }
    },
    methods:{
        show(){
            this.showLayer = true;
        },
        close(){
            this.showLayer = false;
        }

    },
    watch:{
        drawCashFrozenCash(val){
            if(val*1 > 0 && this.from == 'withdrawPage'){
                this.show();
            }
        }
    }
}
</script>
<style scoped>
.layer_style .shenhe{width:4.6875rem;position: absolute;top:-2.34375rem;left:50%;margin-left:-2.34375rem;}
.layer_style .withdrawMoney{ text-align:center;font-size:1rem;color:#2B313D;padding:2.53125rem 0 1rem;display:block;}
.layer_style .list{margin:0 1.125rem;font-size:.6875rem;max-height:14rem;overflow:auto;overflow-x:hidden;}
.layer_style dl.title{line-height:1.25rem;font-size:.6875rem;margin:0 1.125rem;padding-bottom:.125rem;border-bottom:1px solid #DFE3EB;color:#BCC2CC;height:auto;overflow:hidden;}
.layer_style dl.title dt{float:left; white-space: nowrap;}
.layer_style dl.title dd{float:right; white-space: nowrap;}

.layer_style .desc{padding:.5rem 1.125rem 1rem 1.125rem;line-height:1.125rem;color:#2B313D;font-size:.6875rem;}
</style>
