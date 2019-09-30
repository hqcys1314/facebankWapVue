<template>
    <li v-cloak @click="selectThisCoupon()" class="redpack_item" :class="{'invalid' : !itemEnable}">
        <div class="redpack">
            <div class="box">
                <div class="name">{{item.bonusTitle}}</div>
                <div class="infos">
                    <p>
                        <span>
                            {{item.bonusValue}}<em>{{item.bonusModel == 2 ? '%' : item.bonusModel == 1 ? '元' : ''}}</em>
                        </span>
                        <i>{{item.bonusModel == 2 ? '加息红包' : item.bonusModel == 1 ? '返现红包' : ''}}</i>
                    </p>
                </div>
                <div class="selected" v-if="item.id == selectedCoupon.id && itemEnable"></div>
                <div class="lock" :class="{'animate':isLock}" v-if="!itemEnable"></div>
            </div>
        </div>
        <div class="tips" v-if="itemEnable">预计奖励:<span class="orange">{{estimateProfix}}</span>元</div>
        <div class="tips" v-if="!itemEnable" v-html="tipsFont"></div>
    </li>
</template>
<style lang="postcss" src="./discount.css" scoped></style>
<script>
export default {
    name: 'redpackItem',
    props: ['item', 'isEnable', 'selectedCoupon', 'tipsFont', 'estimateProfix'],
    data () {
        return {
            itemEnable : false,
            isLock : false,
            fontTips : '',
        }
    },
    created:function(){
        this.itemEnable = this.item.enable || this.itemEnable;
    },
    methods:{
        selectThisCoupon : function(){
            var _this = this;
            if(this.item.enable){
                this.$emit('selectThisCoupon', this.item)
                this.$emit('selectCouponItem', this.item)
            }else{
                this.isLock = true;
                setTimeout(function(){
                    _this.isLock = false;
                }, 1000)
            }
        }
    },
    watch:{
        isEnable(val){
            this.itemEnable = val;
        },
        "item.enable" (val){
            this.itemEnable = val;
        },
        tipsFont(val){
            this.fontTips = val;
        }
    }
}
</script>
