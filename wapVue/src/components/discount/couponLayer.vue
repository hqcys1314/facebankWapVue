<template>
    <div class="coupon_detail" :style="'left:'+(showThis ? '0%' : '100%')">
            <div class="content">
                <div class="top"><a href="javascript:;" class="close" @click="hideDetail"></a></div>
                <div class="card_info">
                    <!--卡片-->
                    <div class="card_item" :class="'type_'+itemData.card_type" v-if="type == 1">
                        <div class="card">
                            <div class="box">
                                <div class="name">{{itemData.card_name}}</div>
                                <div class="surplus">
                                    剩余{{itemData.day}}天
                                    <!-- <span v-if="itemData.card_status == 1" :class="cardStatus">{{cardStatusFont}}</span> -->
                                </div>
                                <div class="infos">
                                    <p><span>{{itemData.card_proportion}}<em>%</em></span><i>年化返现比例</i></p>
                                    <p>
                                        <span>{{itemData.card_type== 3 ? '无限返现' : itemData.card_num}}<em>{{unitFont[itemData.card_type*1]}}</em>
                                        </span>
                                        <i>{{descFont[itemData.card_type*1]}}</i>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--红包-->
                    <div class="redpack_item" v-if="type == 2">
                        <div class="redpack">
                            <div class="box">
                                <div class="name">{{itemData.bonusTitle}}</div>
                                <div class="infos">
                                    <p>
                                        <span>
                                            {{itemData.bonusValue}}<em>{{itemData.bonusModel == 2 ? '%' : itemData.bonusModel == 1 ? '元' : ''}}</em>
                                        </span>
                                        <i>{{itemData.bonusModel == 2 ? '加息红包' : itemData.bonusModel == 1 ? '返现红包' : ''}}</i>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="title">使用条件</div>
                    <!--卡片-->
                    <div class="desc" v-if="type == 1">
                        <dl>
                            <dt>适用期限</dt>
                            <dd>≥{{itemData.order_term}}天</dd>
                        </dl>
                        <dl>
                            <dt>适用金额</dt>
                            <dd>≥{{itemData.min_money | formatNumber}} {{itemData.min_money*1 < 10000 ? '元' : '万元'}}</dd>
                        </dl>
                        <dl>
                            <dt>适用产品</dt>
                            <dd>{{applicableProduct}}</dd>
                        </dl>
                        <dl>
                            <dt>返现时间</dt>
                            <dd>{{returnTimeFont[itemData.send_type*1]}}时到账</dd>
                        </dl>
                        <dl>
                            <dt>有效期</dt>
                            <dd>{{itemData.start_time + '-' + itemData.end_time}}</dd>
                        </dl>
                    </div>
                    <!--红包-->
                    <div class="desc" v-if="type == 2">
                        <dl>
                            <dt>适用期限</dt>
                            <dd>≥{{itemData.bonusEnableDate}}天</dd>
                        </dl>
                        <dl>
                            <dt>适用金额</dt>
                            <dd v-if="itemData.bonusEnableMoney>0">≥{{itemData.bonusEnableMoney | formatNumber}} {{itemData.bonusEnableMoney*1 < 10000 ? '元' : '万元'}}</dd>
                            <dd v-else>无限制</dd>
                        </dl>
                        <dl>
                            <dt>适用产品</dt>
                            <dd>{{applicableProduct}}</dd>
                        </dl>
                        <dl>
                            <dt>有效期</dt>
                            <dd>{{itemData.bonusValidity}}</dd>
                        </dl>
                    </div>
                </div>
                <div class=""></div>
            </div>
            <a href="javascript:;" v-if="type == '1'" class="btn_tpl" @click="selectThis(itemData)">使用返现卡，预计奖励{{estimateProfix}}元</a>
            <a href="javascript:;" v-if="type == '2'" class="btn_tpl" @click="selectThis(itemData)">使用红包，预计奖励{{estimateProfix}}元</a>

    </div>
</template>
<style src="./discount.css" scoped></style>
<script>
import {calculationProfit} from "tools";
export default {
  name: 'couponDetail',
  props: ['couponInfo', 'showDetail', "proInfo", "amount"],
  data () {
      return {
          type : '',
          estimateProfix : '0.00',
          showThis : false,
          itemData : '',
          applicableProductFont : ['','散标', '智能推荐', '自动投标', '月月笑'],
          applicableProduct : '',
          returnTimeFont : ['','订单结清','投资成功'],

          unitFont : ['', '元', '次', ''],
          descFont : ['', '剩余可返金额', '剩余可用次数', '返现不限次数，不限金额'],
      }
  },
  filters : {
      formatNumber(num){
          if(num*1<10000){
              return num;
          }else{
              return parseInt((num/10000)*100)/100;
          }
      },
  },
  created:function(){},
  methods:{
      currency(number) {
          return parseInt(Number(number).toFixed(2) * 100) / 100
         // return Number(number).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      initCouponDetail(){
          if(this.itemData != ''){
              this.applicableProduct='';
              this.type = this.itemData.order_type ? 1 : 2;
              let applicableType= this.type == 1 ? this.itemData.order_type.split(',') : this.itemData.bonusEnableProduct.split(',');
              for(var i=0; i<applicableType.length; i++){
                  this.applicableProduct += (this.applicableProductFont[applicableType[i]] + ' ');
              }
          }
      },
      selectThis(item){
          this.showThis = false;
          this.$set(item, 'estimateProfix', this.estimateProfix)
          this.$emit('update:showDetail', this.showThis)
          this.$emit('update:showCouponLayer', this.showThis)
          this.$emit('selectCouponItem', item)
          this.$emit('update:couponProfit', this.estimateProfix)
      },
      hideDetail(){
          this.showThis = false;
          this.$emit('update:showDetail', this.showThis)
          //this.$emit('update:couponInfo', '')
          this.$emit('update:couponProfit', 0)
      }
  },
  watch :{

      showDetail(val){
          this.showThis = val;
      },
      // couponInfo(val){
      //     this.itemData = val;
      //     this.initCouponDetail();
      //     let rate = this.type == 2 ? this.itemData.bonusValue : this.itemData.card_proportion,
      //         stype = this.type == 2 ? this.itemData.bonusModel : this.itemData.card_type;
      //     if(this.type == 2){
      //         this.estimateProfix = calculationProfit(
      //             rate,
      //             this.proInfo,
      //             this.amount,
      //             this.type,
      //             stype
      //         )
      //     }else if(this.type == 1){
      //         var yearBill = this.proInfo.termUnit*1 == 1 ? (this.proInfo.termCount*1/365) : this.proInfo.termUnit*1 == 3 ? (this.proInfo.termCount*1/12) : 0;
      //         let profix = (this.amount *1) * (rate*1/100) * yearBill;
      //         if(profix*1 >= this.itemData.card_num*1 && this.itemData.card_type == '1'){
      //             this.estimateProfix = this.currency(this.itemData.card_num);
      //         }else{
      //             this.estimateProfix = this.currency(profix);
      //         }
      //
      //     }
      //
      // }
  }
}
</script>
