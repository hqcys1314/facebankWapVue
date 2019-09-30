<template>
  <div class="creditorTransferDetail" v-cloak>
      <div class="switch_tab">
          <ul>
    	<li v-on:click="listTab(1)" style="width:50%;" v-bind:class="{current : tabIndex_1}"
      class="sensors-btn" sensors-name="直投列表_债权详情_标的出借信息">转让信息</li>
    	<li v-on:click="listTab(2)" style="width:50%;" v-bind:class="{current : tabIndex_2}"
  class="sensors-btn" sensors-name="直投列表_债权详情_标的详情">标的详情</li>
      </ul>
  </div>
      <div v-show="tabIndex_1">
    	<div class="item_box">
    	  <div class="title">转让信息</div>
    	  <div class="item_dl">
    		  <dl>
      		  <dt>债权转让人</dt>
      		  <dd>{{CreditUserData.translateUserName}}</dd>
      		</dl>
      		<dl>
      		  <dt>身份证号码</dt>
      		  <dd>{{CreditUserData.translateUserId}}</dd>
      		</dl>
      		<dl>
      		  <dt>转让金额</dt>
      		  <dd>{{parameData.translateAmount}}元</dd>
      		</dl>
      		<dl>
      		  <dt>转让时间</dt>
      		  <dd>{{parameData.transferDate}}</dd>
      		</dl>
    	  </div>
    	</div>
      </div>
      <div v-show="tabIndex_2">
    	<div class="item_box">
    	  <div class="title">标的信息</div>
    	  <div class="item_dl">
    		<dl>
    		  <dt>助贷机构</dt>
    		  <dd>{{creditDetailData.channelName}}</dd>
    		</dl>
    		<dl>
    		  <dt>标的编号</dt>
    		  <dd>{{creditDetailData.loanNum}}</dd>
    		</dl>
    		<dl>
    		  <dt>借款用途</dt>
    		  <dd>{{creditDetailData.borrowerUseName}}</dd>
    		</dl>
    		<dl>
    		  <dt>借款金额</dt>
    		  <dd>{{toFixed(creditDetailData.amount)}}元</dd>
    		</dl>
    		<dl>
    		  <dt>借款期限</dt>
    		  <dd>{{creditDetailData.termCount}}{{termUnit[creditDetailData.termUnit]}}</dd>
    		</dl>
    		<dl>
    		  <dt>还款方式</dt>
    		  <dd>{{productType[creditDetailData.productType]}}</dd>
    		</dl>
    		<dl>
    		  <dt>申请时间</dt>
    		  <dd>{{creditDetailData.applyDate}}</dd>
    		</dl>
    		<dl>
    		  <dt>借款简介</dt>
    		  <dd>借款人于{{formatDate(creditDetailData.applyDate)}}借款用于{{creditDetailData.borrowerUseName}}</dd>
    		</dl>

    		<dl>
    		  <dt>截止借款前6个月内借款人征信报告中的逾期情况</dt>
    		  <dd>{{creditDetailData.creditOverdueCount}}</dd>
    		</dl>
    		<dl>
    		  <dt>借款人在其他借款平台的借款情况</dt>
    		  <dd>{{creditDetailData.otherPlatformBorrowCount}}</dd>
    		</dl>
    		<dl style="display:none;">
    		  <dt>底层借款利率</dt>
    		  <dd>{{creditDetailData.actualRate}}</dd>
    		</dl>
    		<dl>
    		  <dt>逾期罚息（利率）</dt>
    		  <dd>{{creditDetailData.overdueInterest}}</dd>
    		</dl>
    		<dl>
    		  <dt>各类服务费</dt>
    		  <dd>{{creditDetailData.otherFee}}</dd>
    		</dl>
    		<dl>
    		  <dt>还款来源</dt>
    		  <dd>{{creditDetailData.sourceOfRepayment}}</dd>
    		</dl>
    	  </div>
    	</div>
    	<div class="item_box">
    	  <div class="title">借款人信息</div>
    	  <div class="item_dl">
    		<dl>
    		  <dt>姓名</dt>
    		  <dd>{{creditDetailData.borrowerName}}</dd>
    		</dl>
    		<dl>
    		  <dt>身份证号码</dt>
    		  <dd>{{creditDetailData.borrowerIdcard}}</dd>
    		</dl>
    		<dl>
    		  <dt>手机号码</dt>
    		  <dd>{{creditDetailData.borrowerPhone}}</dd>
    		</dl>


    		<dl>
    			<dt>行业</dt>
    			<dd>{{creditDetailData.borrowerPosition}}</dd>
    		</dl>
    		<dl>
    			<dt>年龄</dt>
    			<dd>{{creditDetailData.borrowerAge}}</dd>
    		</dl>
    		<dl style="display:none">
    			<dt>居住城市</dt>
    			<dd>{{creditDetailData.borrowerAddress}}</dd>
    		</dl>
    		<dl>
    			<dt>收入</dt>
    			<dd>{{creditDetailData.borrowerIncome}}</dd>
    		</dl>
    		<dl>
    			<dt>历史借款情况</dt>
    			<dd>{{creditDetailData.historyRepaymentDetail}}</dd>
    		</dl>

    		<dl>
    		  <dt>平台借款金额</dt>
    		  <dd>{{creditDetailData.borrowerRepayingTotalAmount}}</dd>
    		</dl>
    		<dl>
    		  <dt>限额管理</dt>
    		  <dd>借款人该笔借款没有超过监管要求的借款余额上限。</dd>
    		</dl>
    		<dl>
    		  <dt>逾期次数</dt>
    		  <dd>{{creditDetailData.overdueTotalTimes}}</dd>
    		</dl>
    		<dl>
    		  <dt>逾期总金额</dt>
    		  <dd>{{creditDetailData.overdueTotalAmount ? creditDetailData.overdueTotalAmount : '0元'}}</dd>
    		</dl>
            <dl>
                <dt>征信报告情况</dt>
                <dd>平台已根据借款人客群特征，对其还款意愿及还款能力进行了综合评估，符合平台风控标准。借款人未提供央行征信报告。
                    <small>注：借款人未提供征信报告可能存在信用风险，请审慎做成决策。</small>
                </dd>
            </dl>
    	  </div>
    	</div>
      </div>


      <loading :show.sync="showLoading"></loading>
      <!--统一提示层-->
      <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
  </div>
</template>

<style scoped src="./creditorTransferDetail.css">

</style>

<script>
import * as constants from './creditorTransferDetailConstants';
import {utils} from 'tools';
import loading from '@/components/loading';
import informationLayer from '@/components/informationLayer';
export default {
    name: constants.NAME,
    data() {
        return {
            tabIndex_1 : true,
            tabIndex_2 : false,

            productType : ['','先息后本','一次性还本付息','等额本息','等本等息',''],

            termUnit : ['','天','周','个月', '年'],

            parameData : {},
            transferUserId : '',
            creditId : '',
            orderId : '',
            CreditUserData : '',

            creditDetailData : {},

            showLoading : false,

            informationLayerContent : '',
            showLayerStatus : false,
        }
    },
    components:{loading, informationLayer},
    created:function () {
        var _this = this;

        this.parameData = utils.getParames();
        this.transferUserId = this.parameData.transferUserId;
        this.creditId = this.parameData.creditId;
        this.orderId = this.parameData.fpOrderId;
        this.parameData.transferDate = decodeURIComponent(this.parameData.transferDate);

        this.showLoading = true;
        $.when(_this.getcreditUserInfo(), _this.getCreditDetail()).then(function(userData, creditData){
            _this.showLoading = false;
            _this.CreditUserData = userData;
            _this.creditDetailData = creditData;
        })
    },
    methods: {
        getcreditUserInfo(){
            var _this = this;
            var def = $.Deferred();
            $.ajax({
              url : utils.AJAXDOMAINNAME+ '/wap/credit/translateUserDetail',
                data : '{"transferUserId":"'+ decodeURIComponent(decodeURIComponent(_this.transferUserId)) +'"}',
                complete : function(){
                    _this.showLoading = false;
                },
                success : function(res){
                    if(res.code==1){
                        def.resolve(res.data);
                    }else{
                        _this.showLayer(res.message)
                    }
                }
            })
            return def.promise();
        },
        getCreditDetail(){
            var _this = this;
            var def = $.Deferred();
            $.ajax({
              url : utils.AJAXDOMAINNAME+ '/wap/getCreditDetailByCreditId',
                data : '{"creditId":"'+ _this.creditId +'","orderId":"'+ _this.orderId +'"}',
                complete : function(){
                    _this.showLoading = false;
                },
                success : function(res){
                    if(res.code==1){
                        def.resolve(res.data);
                    }else{
                        _this.showLayer(res.message)
                    }
                }
            })
            return def.promise();
        },
        showLayer(content){
            this.informationLayerContent = content;
            this.showLayerStatus = true;
        },
        formatDate : function(date){
            if(date){
                var dates = new Date(date.replace(/-/g,'/')),
                    month = dates.getMonth()+1,
                    day = dates.getDate();
                month = month < 10 ? ('0' + month) : month;
                day = day < 10 ? ('0' + day) : day;
                return dates.getFullYear() + '年' + month + '月' + day + '日';
            }
        },
        //tab键切换
        listTab : function(num) {
          if (num == 1) {
              this.tabIndex_1=true;
              this.tabIndex_2=false;
          } else if (num == 2) {
              this.tabIndex_1=false;
              this.tabIndex_2=true;
          }
        },
        toFixed:function(number, digit){
        	var numbers = number || 0,
        		digits = digit || 2;
        	return Number(numbers).toFixed(digits);
        }
    }
}
</script>
