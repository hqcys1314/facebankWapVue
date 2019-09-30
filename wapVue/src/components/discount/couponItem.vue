<template>
    <li v-cloak @click="selectThisCoupon()" :class="'card_item type_'+item.card_type + (!itemEnable ? ' invalid' : '')">
        <div class="card">
            <div class="box">
                <div class="name">{{item.card_name}}</div>
                <div class="surplus">
                    剩余{{item.day}}天
                </div>
                <div class="infos">
                    <p><span>{{item.card_proportion}}<em>%</em></span><i>年化返现比例</i></p>
                    <p>
                        <span>{{item.card_type== 3 ? '无限返现' : item.card_num}}<em>{{unitFont[item.card_type*1]}}</em>
                        </span>
                        <i>{{descFont[item.card_type*1]}}</i>
                    </p>
                </div>
                <div class="selected" v-if="item.card_id == selectedCoupon.card_id && itemEnable"></div>
                <div class="lock" :class="{'animate':isLock}" v-if="!itemEnable"></div>
            </div>
        </div>
        <div class="tips" v-if="itemEnable">预计奖励:<span class="orange">{{estimateProfix}}</span>元</div>
        <div class="tips" v-if="!itemEnable" v-html="fontTips"></div>
    </li>
</template>
<style lang="postcss" src="./discount.css" scoped></style>
<script>
export default {
  name: 'couponItem',
  props: ['item', 'isEnable', 'selectedCoupon', 'tipsFont', 'estimateProfix'],
  data () {
      return {
          itemEnable : false,
          isLock : false,
          fontTips : '',

          unitFont : ['', '元', '次', ''],
          descFont : ['', '剩余可返金额', '剩余可用次数', '返现不限次数，不限金额'],

      }
  },
  created:function(){
      this.itemEnable = this.item.enable || this.itemEnable;
      this.fontTips = this.item.tipsFont
  },
  methods:{
      selectThisCoupon : function(item){
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
  watch : {
      isEnable(val){
          this.itemEnable = val;
      },
      "item.estimateProfix":function(){

      },
      tipsFont(val){
          this.fontTips = val;
      }
  }
}
</script>
