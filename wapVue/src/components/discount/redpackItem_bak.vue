<template>
    <li @click="showDetailLayer" class="redpack_item" :class="{'invalid' : !itemEnable}">
        <div class="redpack">
            <div class="box">
                <div class="name">{{item.bonusTitle}}</div>
                <div class="infos">
                    <p>
                        <span>
                            {{item.bonusValue}}
                            <em>{{item.bonusModel == 2 ? '%' : item.bonusModel == 1 ? '元' : ''}}</em>
                        </span>
                        <i>{{item.bonusModel == 2 ? '加息红包' : item.bonusModel == 1 ? '返现红包' : ''}}</i>
                    </p>
                </div>
                <div class="selected" v-if="item.id == selectedCoupon.id && itemEnable"></div>
                <div class="lock" :class="{'animate':isLock}" v-if="!itemEnable"></div>
            </div>
        </div>
        <div class="tips" v-if="!itemEnable" v-html="tipsFont"></div>
    </li>
</template>
<style src="./discount.css" scoped></style>
<script>
export default {
    name: 'redpackItem',
    props: ['item', 'productType', 'selectedCoupon', 'isEnable', "investAmount", "tremDayCal", "productData", "timer"],
    data () {
        return {
            itemEnable : false,
            isLock : false,

            amount : 0,
            tipsFont : '',

            applicableProductFont : ['', '散标','智能推荐', '自动投标', '月月笑'],
        }
    },
    created:function(){
    },
    methods:{
        initListItem(){
            let items = this.item;
            let applicableType= items.bonusEnableProduct.split(','),
                applicableProduct = [];
            for(var i=0; i<applicableType.length; i++){
                applicableProduct.push(this.applicableProductFont[applicableType[i]]);
            }
            applicableProduct = applicableProduct.join('、')
            //金额y【不满足】 && 期限x【不满足】 && 产品z【满足】

            let productIf = items.bonusEnableProduct.indexOf(this.productType) > -1,
                tremDayIf = this.tremDayCal * 1 >= items.bonusEnableDate * 1,
                amountIf = this.amount * 1 >= items.bonusEnableMoney*1,
                time = items.bonusEnableDate+'天',
                money = (items.bonusEnableMoney*1 - this.amount*1);
            //let if2 = (items.bonusEnableProduct.indexOf(this.productType) > -1 && this.amount * 1 >= items.bonusEnableMoney * 1 && this.tremDayCal * 1 >= items.bonusEnableDate * 1);
            this.itemEnable = (amountIf && tremDayIf && productIf && items.enable);
            if(amountIf){
                if(productIf && tremDayIf){
                }else if(!tremDayIf && !productIf){
                    this.tipsFont = "出借至"+ time +"以上、"+ applicableProduct +"产品可以使用该红包"
                }else if(!tremDayIf || productIf){
                    this.tipsFont = "出借至"+ time +"以上产品可以使用该红包"
                }else if(tremDayIf || !productIf){
                    this.tipsFont = "出借至"+ applicableProduct +"产品可以使用该红包"
                }
            }else{
                if(!productIf && !tremDayIf){
                    this.tipsFont = "出借至"+ time +"以上、"+ applicableProduct +"产品可以使用该红包"
                }else if(tremDayIf && productIf){
                    this.tipsFont = "还差<span>"+money+"</span>元可以使用该红包"
                }else if(!tremDayIf || productIf){
                    this.tipsFont = "出借至"+ time +"以上产品可以使用该红包"
                }else if(tremDayIf || !productIf){
                    this.tipsFont = "出借至"+ applicableProduct +"产品可以使用该红包"
                }
            }
        },
        showDetailLayer : function(){
            var _this = this;
            if(this.itemEnable){
                this.$emit('showDetailLayer', this.item)
            }else{
                this.isLock = true;
                setTimeout(function(){
                    _this.isLock = false;
                }, 1000)
            }
        }
    },
    watch:{
        investAmount(val){
            this.amount = val;
            this.initListItem();
        },
        timer(val){
            this.amount = this.investAmount;
            this.initListItem()
        }
    }
}
</script>
