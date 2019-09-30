<template>
    <div v-cloak>
        <div class="item_box">
            <a href="javascript:;">
                <p @click="showCouponLayer()">
                    <span class="span1">卡券优惠</span>
                    <i class="iconfont icon-ic_rightarrow"></i>
                    <span class="estProfix" v-if="selectedCoupon.estimateProfix*1>0">+{{selectedCoupon.estimateProfix|currency}}</span>
                    <small v-if="availableCouponCount > 0 && selectedCoupon ==''">您有 <i>{{availableCouponCount}}</i> 张优惠券可用</small>
                    <small v-if="availableCouponCount == 0">当前无可用卡券</small>
                    <small class="selected" v-if="availableCouponCount > 0 && selectedCoupon.bonusModel">
                        {{selectedCoupon.bonusModel*1 == 1 ? ('返现红包+'+ selectedCoupon.bonusValue +'元') : ('加息红包+'+ selectedCoupon.bonusValue +'%')}}
                    </small>
                    <small class="selected" v-if="availableCouponCount > 0 && selectedCoupon.card_type">
                        {{
                            selectedCoupon.card_type*1 == 1 ?
                            '定额卡 ' :
                            selectedCoupon.card_type*1 == 2 ?
                            '次卡 ' :
                            selectedCoupon.card_type*1 == 3 ?
                            '无限卡' : ''
                        }}
                        +{{selectedCoupon.card_proportion}}%
                    </small>
                </p>
                <small v-if="showSTips" :class="{'animate' : showSTips}" class="stips">请选择优惠方式<i @click="hideSTips"></i></small>
            </a>
        </div>

        <div class="layer_coupon" :style="'left:'+(showCoupon ? '0%' : '100%')">
            <div class="coupon_box">
                <ul class="cart_list" v-if="couponCardList.length > 0">
                    <h3>使用返现卡</h3>
                    <couponItem
                        v-for="(item, key) in couponCardListData"
                        :key="key"
                        :item="item"
                        :isEnable.sync="item.enable"
                        :tipsFont.sync="item.tipsFont"
                        :estimateProfix.sync="item.estimateProfix"
                        @selectThisCoupon="selectThisCoupon"
                        :selectedCoupon="selectedCoupon"
                        detailType="1"
                    ></couponItem>
                </ul>
                <ul class="redpack_list" v-if="redbagListData.length > 0">
                    <h3>使用红包</h3>
                    <redpackItem
                        v-for="(item, key) in redbagListData"
                        :key="key"
                        :item="item"
                        :isEnable.sync="item.enable"
                        :tipsFont.sync="item.tipsFont"
                        :estimateProfix.sync="item.estimateProfix"
                        @selectThisCoupon="selectThisCoupon"
                        :selectedCoupon="selectedCoupon"
                    ></redpackItem>
                </ul>
            </div>
            <a href="javascript:;" @click="notUseCoupon" class="footer">不使用卡券优惠</a>
        </div>
        <couponLayer
            :amount="amount"
            :proInfo.sync="productData"
            :showCouponLayer.sync="showCoupon"
            :showDetail.sync="showDetailLayerStatus"
            :couponInfo.sync="selectedCoupon"
            @selectCouponItem="selectThis"
        ></couponLayer>

        <discountLayer
            :show.sync="showDiscountLayer"
            :agreementState.sync="discountAgreementState"
            @abandonSelect="abandonSelect"
            @investConfirm="investConfirm"
            @selectCouponFn="showCouponLayer"
        ></discountLayer>
        <agreementLayer
            :show.sync="showAgreementStateLayer"
            :proInfo.sync="productData"
            @investConfirm="investConfirm"
            @abandonSelectChange="abandonSelectChange"
        ></agreementLayer>
        <layerAgreement ref="layerAgreement"></layerAgreement>
    </div>
</template>
<style src="./discount.css" scoped></style>
<script>
import {utils} from 'tools';
import {calculationProfit} from "tools";
import couponItem from './couponItem';
import couponLayer from './couponLayer';
import redpackItem from './redpackItem';
import discountLayer from './discountLayer';
import agreementLayer from './agreementLayer';
export default {
  name: 'discount',
  props: ['curentSelectCoupon', "investAmount", "proInfo", "tremDayCal", "productType", "agreementState","nowDay","firstRepaymentDate", 'noAgreementLayer', 'isDeposit', 'depositProInfo'],
  components : {couponItem, couponLayer, redpackItem, discountLayer, agreementLayer},
  data () {
      return {
          showCoupon : false,
          amount : 0,
          tremDayCals : 0,
          redbagList : [],
          redbagListData : [],
          redbagCount : 0,
          couponCardList : [],
          couponCardListData : [],
          couponCardCount : 0,
          availableCouponCount : 0,//可用卡券总数


          productData : '',

          selectedCoupon : "",
          showDetailLayerStatus : false,

          estimateProfix : '0.00',
          showDiscountLayer : false,
          discountAgreementState : false,
          confirmNotSelect : false,
          showAgreementStateLayer : false,

          showSTips : false,
          timer : Date.parse(new Date()),

          applicableProductFont : ['', '散标','智能推荐', '自动投标', '月月笑'],
      }
  },
  created:function(){},
  methods:{
      currency(number) {
          return parseInt(Number(number).toFixed(2) * 100) / 100
      },
      //隐藏小提示层
      hideSTips(){
          this.showSTips = false;
          utils.setCookie('couponSTips', 'showed', 300000000)
      },
      //浮层操作
      showCouponLayer(item){
          if(this.availableCouponCount > 0){
              var _this = this;
              this.showCoupon = true;
              this.timer = Date.parse(new Date())

          }
      },
      notUseCoupon(){
          let cts = utils.getCookie('couponSTips');
          if(this.availableCouponCount > 0 && cts != "showed"){
              this.showSTips = true;
          }
          this.showCoupon = false;
          this.selectedCoupon = '';
          this.$emit('selectedCoupon', '');

      },

      selectThisCoupon(item){
          this.showCoupon = false;
          this.selectedCoupon = item;
          this.$emit('selectedCoupon', item);
      },

      //放弃选择
      abandonSelect(){
          this.confirmNotSelect = true;
          if(!this.discountAgreementState && this.noAgreementLayer != 'no'){
              this.showAgreementStateLayer = true;
          }else{
              this.$emit('investConfirm','')
          }
      },
      //放弃选择
      showAgreementLayer(){
          this.showAgreementStateLayer = true;
      },
      abandonSelectChange(val){
          this.confirmNotSelect = val;
      },
      investConfirm(){
          this.confirmNotSelect = true;
          if(this.noAgreementLayer != 'no'){
              this.discountAgreementState = true;
          }
          this.$emit('update:agreementState', this.discountAgreementState)
          this.$emit('investConfirm','')
      },
      //数据操作
      selectThis(item){
          this.selectedCoupon = item;
          this.$emit('selectedCoupon', this.selectedCoupon)
      },
      showDiscountTipsLayer(agreementState){
          this.discountAgreementState = agreementState;
          this.showDiscountLayer = true;
      },
      //获取列表
      getRedPackList(){
          var _this= this;
          var def = $.Deferred();
          $.ajax({
            url : utils.AJAXDOMAINNAME+ '/wap/redpackage/list',
              data: '{"type":"0","pageNum":"1","pageSize":"200"}',
              success : function(res){
                  def.resolve(res);
              }
          })
          return def.promise();
      },
      getCouponCardList(){
          var _this= this;
          var def = $.Deferred();
          $.ajax({
            url : utils.AJAXDOMAINNAME+ '/wap/getUserAllBCCard',
              data: '{"type":"0"}',
              success : function(res){
                  def.resolve(res);
              }
          })
          return def.promise();
      },
      getApplicableType(productType){
          var applicableType = productType.split(','),
              applicableProduct = [];
          for(var i=0; i<applicableType.length; i++){
              applicableProduct.push(this.applicableProductFont[applicableType[i]]);
          }
          return applicableProduct.join('、')
      },
      calculationSignProfit(type, itemData){
          let rate = type == 2 ? itemData.bonusValue : itemData.card_proportion,
              stype = type == 2 ? itemData.bonusModel : itemData.card_type,
              estimateProfix = '0.00';
          let proInfo = this.isDeposit*1 == 0 ? this.depositProInfo : this.proInfo;
          if(type == 2){
              estimateProfix = calculationProfit(
                  rate,
                  proInfo,
                  this.investAmount,
                  type,
                  stype,
                  this.nowDay,
                  this.firstRepaymentDate,
              )
          }else if(type == 1){
              let yearBill = 0;
              if(this.isDeposit*1 == 0){
                  yearBill = this.depositProInfo.termCount*1/365;
              }else{
                  yearBill = this.proInfo.termUnit*1 == 1 ? (this.proInfo.termCount*1/365) : this.proInfo.termUnit*1 == 3 ? (this.proInfo.termCount*1/12) : 0;
              }
              let profix = (this.investAmount *1) * (rate*1/100) * yearBill;
              if(profix*1 >= itemData.card_num*1 && itemData.card_type == '1'){
                  estimateProfix = this.currency(itemData.card_num);
              }else{
                  estimateProfix = this.currency(profix);
              }
          }
          return estimateProfix
      },
      filterCouponData (){
          this.couponCardListData = [];
          if(this.couponCardList.length <= 0) return false
          let _this = this;
          let trueData = [], falseData = [];
          for(let i in this.couponCardList){
              let items = this.couponCardList[i];
              /*let nowDate = Date.parse(new Date()),
                  startDate = Date.parse(new Date(items.start_time.replace(/./g, '/') + ' 00:00:00')),
                  endDate = Date.parse(new Date(items.end_time.replace(/./g, '/') + ' 23:59:59'));
              let dateIsEffective = nowDate >= startDate && nowDate <= endDate;*/

              /*let date = new Date(),
                  nowDate = date.getFullYear() + '-' + this.format10(date.getMonth() + 1) + '-' + this.format10(date.getDate()) + ' ' + this.format10(date.getHours()) + ':' + this.format10(date.getMinutes()) + ':' + this.format10(date.getSeconds()),
                  startDate = items.start_time.replace(/./g, '-') + ' 00:00:00',
                  endDate = items.end_time.replace(/./g, '-') + ' 23:59:59',
                  dateIsEffective = nowDate >= startDate && nowDate <= endDate;*/


              let applicableProduct = _this.getApplicableType(items.order_type)
              //金额y【不满足】 && 期限x【不满足】 && 产品z【满足】

              let productIf = items.order_type.indexOf(this.productType) > -1,
                  tremDayIf = this.tremDayCals * 1 >= items.order_term * 1,
                  amountIf = this.investAmount * 1 >= items.min_money*1,
                  time = items.order_term+'天',
                  money = this.currency(items.min_money*1 - this.investAmount*1);
              //items['enable'] = (amountIf && tremDayIf && productIf && dateIsEffective);
              items['enable'] = (amountIf && tremDayIf && productIf);
              //if(dateIsEffective){
                  if(amountIf){
                      if(productIf && tremDayIf){
                      }else if(!tremDayIf && !productIf){
                          items['tipsFont'] = "出借至"+ time +"以上、"+ applicableProduct +"产品可以使用该返现卡"
                      }else if(!tremDayIf || productIf){
                          items['tipsFont'] = "出借至"+ time +"以上产品可以使用该返现卡"
                      }else if(tremDayIf || !productIf){
                          items['tipsFont'] = "出借至"+ applicableProduct +"产品可以使用该返现卡"
                      }
                  }else{
                      if(!productIf && !tremDayIf){
                          items['tipsFont'] = "出借至"+ time +"以上、"+ applicableProduct +"产品可以使用该返现卡"
                          items['tipsFont'] += "<br>还差<span class='orange' style='color:#F48A12'>"+money+"</span>元可以使用该返现卡"
                      }else if(tremDayIf && productIf){
                          items['tipsFont'] = "还差<span class='orange' style='color:#F48A12'>"+money+"</span>元可以使用该返现卡"
                      }else if(!tremDayIf || productIf){
                          items['tipsFont'] = "出借至"+ time +"以上产品可以使用该返现卡"
                          items['tipsFont'] += "<br>还差<span class='orange' style='color:#F48A12'>"+money+"</span>元可以使用该返现卡"
                      }else if(tremDayIf || !productIf){
                          items['tipsFont'] = "出借至"+ applicableProduct +"产品可以使用该返现卡"
                          items['tipsFont'] += "<br>还差<span class='orange' style='color:#F48A12'>"+money+"</span>元可以使用该返现卡"
                      }
                  }
              // }else{
              //     items['tipsFont'] = "该返现卡不在有效期内";
              // }
              if(items['enable']){
                  items['tipsFont'] = '';
                  items['estimateProfix'] = this.calculationSignProfit(1, items);
                  trueData.push(items)
                  this.availableCouponCount++;
              }else{
                  falseData.push(items)
              }
          }
          trueData = trueData.sort(function(a, b){
              return a.create_time*1 > b.create_time*1
          })
          falseData = falseData.sort(function(a, b){
              return a.create_time*1 > b.create_time*1
          })
          this.couponCardListData = trueData.concat(falseData);
      },
      format10(val){
          return val < 10 ? '0' + val : val;
      },
      filterRedpackData(){
          this.redbagListData = [];
          if(this.redbagList.length <= 0) return false
          let _this = this;
          let trueData = [], falseData = [];
          for(let i=0; i<this.redbagList.length; i++){
              let items = this.redbagList[i];
              /*let nowDate = Date.parse(new Date()),
                  startDate = Date.parse(new Date(items.startDate.replace(/-/g, '/') + ' 00:00:00')),
                  endDate = Date.parse(new Date(items.endDate.replace(/-/g, '/') + ' 23:59:59'));*/

              /*let date = new Date(),

                  nowDate = date.getFullYear() + '-' + this.format10(date.getMonth() + 1) + '-' + this.format10(date.getDate()) + ' ' + this.format10(date.getHours()) + ':' + this.format10(date.getMinutes()) + ':' + this.format10(date.getSeconds()),
                  startDate = items.startDate + ' 00:00:00',
                  endDate = items.endDate + ' 23:59:59',
                  dateIsEffective = nowDate >= startDate && nowDate <= endDate;*/



              //let dateIsEffective = nowDate >= startDate && nowDate <= endDate;

              let applicableProduct = _this.getApplicableType(items.bonusEnableProduct)
              let amountIf = this.investAmount * 1 >= items.bonusEnableMoney*1,
                  tremDayIf = this.tremDayCals * 1 >= items.bonusEnableDate * 1,
                  productIf = items.bonusEnableProduct.indexOf(this.productType) > -1,
                  time = items.bonusEnableDate+'天',
                  money = this.currency(items.bonusEnableMoney*1 - this.investAmount*1);
              //items['enable'] = (amountIf && tremDayIf && productIf && dateIsEffective);
              items['enable'] = (amountIf && tremDayIf && productIf);
              //if(dateIsEffective){
                  if(amountIf){
                      if(productIf && tremDayIf){
                      }else if(!tremDayIf && !productIf){
                          items['tipsFont'] = "出借至"+ time +"以上、"+ applicableProduct +"产品可以使用该红包"
                      }else if(!tremDayIf || productIf){
                          items['tipsFont'] = "出借至"+ time +"以上产品可以使用该红包"
                      }else if(tremDayIf || !productIf){
                          items['tipsFont'] = "出借至"+ applicableProduct +"产品可以使用该红包"
                      }
                  }else{
                      if(!productIf && !tremDayIf){
                          items['tipsFont'] = "出借至"+ time +"以上、"+ applicableProduct +"产品可以使用该红包"
                          items['tipsFont'] += "<br>还差<span class='orange' style='color:#F48A12'>"+money+"</span>元可以使用该红包"
                      }else if(tremDayIf && productIf){
                          items['tipsFont'] = "还差<span class='orange' style='color:#F48A12'>"+money+"</span>元可以使用该红包"
                      }else if(!tremDayIf || productIf){
                          items['tipsFont'] = "出借至"+ time +"以上产品可以使用该红包"
                          items['tipsFont'] += "<br>还差<span class='orange' style='color:#F48A12'>"+money+"</span>元可以使用该红包"
                      }else if(tremDayIf || !productIf){
                          items['tipsFont'] = "出借至"+ applicableProduct +"产品可以使用该红包"
                          items['tipsFont'] += "<br>还差<span class='orange' style='color:#F48A12'>"+money+"</span>元可以使用该红包"
                      }
                  }
              // }else{
              //     items['tipsFont'] = "该红包不在有效期内"
              // }
              if(items['enable']){
                  items['tipsFont'] = '';
                  items['estimateProfix'] = this.calculationSignProfit(2, items);
                  trueData.push(items)
                  this.availableCouponCount++;
              }else{
                  falseData.push(items)
              }
              //this.$set(this.redbagList, i, items)
          }
          trueData = trueData.sort(function(a, b){
              return Date.parse(a.endDate.replace(/-/g, '/')) > Date.parse(b.endDate.replace(/-/g, '/'))
          })
          falseData = falseData.sort(function(a, b){
              return Date.parse(a.endDate.replace(/-/g, '/')) > Date.parse(b.endDate.replace(/-/g, '/'))
          })
          this.redbagListData = trueData.concat(falseData);
      },
      initialization : function(){
          var _this = this;
          this.productData = this.proInfo;
          this.tremDayCals = this.tremDayCal;
          $.when(this.getRedPackList(), this.getCouponCardList()).then(function(redPackRes, couponCardRes){
              if(redPackRes.code*1 == 1){
                  var redPack = redPackRes.data.redPackageDtoList;
                  if (redPack != "" || redPack != null) {
                      _this.redbagList = redPack;
                      for(let key in _this.redbagList){
                          _this.redbagList[key]['enable'] = false;
                      }
                      _this.redbagCount = redPack.length;
                  }
              }else{
                  _this.$parent.showLayer(redPackRes.message);
              }

              if(couponCardRes.code*1 == 1){
                  var couponCard = couponCardRes.data;
                  if (couponCard != null && couponCard.cardList != "") {
                      _this.couponCardList = couponCard;
                      for(let key in _this.couponCardList){
                          _this.couponCardList[key]['enable'] = true;
                      }
                      _this.couponCardCount = couponCard.length;
                  }
              }else{
                  _this.$parent.showLayer(couponCardRes.message);
              }
              _this.redbagListData = [];
              _this.couponCardListData = [];
              _this.filterRedpackData();
              _this.filterCouponData();
          })
      }
  },
  watch : {
      curentSelectCoupon : function(val){
          this.selectedCoupon = val;
          if(val!=''){
              this.showSTips = false;
          }
      },
      selectedCoupon(val){
          if(val!=''){
              this.showSTips = false;
          }
      },
      tremDayCal : function(val){
          this.tremDayCals = val
      },
      investAmount : function(val){
          this.amount = val;
          this.availableCouponCount = 0;
          this.selectedCoupon = '';
          this.$emit('selectedCoupon', '');
          this.filterRedpackData();
          this.filterCouponData();
      },
      couponCardList(val){
          this.couponCardList = val;
      },
      couponCardListData(val){
          this.couponCardListData = val;
      },
      proInfo(val){
          this.productData = val;
      },
      agreementState(val){
          this.discountAgreementState = val;
      },
      availableCouponCount(val){
          var cookie = utils.getCookie('couponSTips');
          if(val > 0 && cookie != 'showed'){
              this.showSTips = true;
          }
      }
  }
}
</script>
