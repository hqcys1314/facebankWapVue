<template>
  <div class="timeDepositRecordDetail" ref="detailPage">
      <div id="pageContent">
          <div class="amdList" v-if="creditListData.length > 0">
          		<ul class="list-type">
                    <onSaleItem v-for="(item, index) in creditListData" :key="index" :item="item" itemType="credit" @click.native="gotoPage(item)"></onSaleItem>
          		</ul>
          </div>
          <empty text="当前无债权" v-if="!fullScreenLoadingShow && creditListData.length == 0"></empty>
          <smileLoading  :showSmileLoading="fullScreenLoadingShow"></smileLoading>
      </div>
  </div>
</template>

<style src="./timeDepositRecordDebtList.css"></style>

<script>
import * as constants from './timeDepositRecordDebtListConstants';
import {utils} from 'tools';
import onSaleItem from '@/components/onSaleItem';
export default {
    name:    constants.NAME,
    components:{onSaleItem},
    data() {
        return {
            orderId: '',
            creditId: '',
            loanId: '',

            fullScreenLoadingShow : true,

            creditListData : [],

            pageNum : 1,


            //是否已起息
            stateClass: 'state_',
            orderState: ['系统出借中', '持有中', '已结清', '流标', '提前还款'],

            termUnit: ['', '天', '周', '月', '年'],

            //repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],


            profitData : '',

            isLoading:true,
            reloadDataStatus:false,
            isDisable:true,
            enLong:false,
        }
    },
    created: function() {
        var _this = this;
        this.orderId = this.$route.query.orderId;
    },
    mounted : function(){
        var _this = this;
        this.getCreditList();
        this.$refs.detailPage.addEventListener('scroll', ()=>{
            var domHeight = _this.$refs.detailPage.getElementsByTagName('div')[0].clientHeight;
            var scrollTop = _this.$refs.detailPage.scrollTop;
            var seeHeight = _this.$refs.detailPage.clientHeight;
            if(domHeight-scrollTop<seeHeight*1+200){
                if(!_this.isDisable) return;
                _this.getCreditList();

            }
        })
    },
    methods: {
        formatDate: function(date) {

        },
        gotoPage:function(item){
            this.$router.push({
                path : '/timeDepositRecordDebtDetail',
                query : {
                    creditId : item.creditId,
                    loanId : item.loanId,
                    orderId : this.orderId,
                    investContract : item.investContract,
                    bizStatus : item.bizStatus,
                    amount : item.amount,
                    proType : 'deposit',
                    nextLoanTransferId : item.nextLoanTransferId
                }
            })
        },
        getCreditList : function(){
            var _this = this;
            _this.isDisable = false;
            $.ajax({
                url: _this.utils.AJAXDOMAINNAME + '/wap/order/sdqOrderCreditList',
                data: '{"pageNum":' + _this.pageNum + ',"orderId":"' + _this.orderId + '"}',
                complete:function(){
                    _this.fullScreenLoadingShow = false;
                    _this.isLoading=false;
                    if(_this.creditListData.length>=10){
                        _this.enLong=true;
                    }
                },
                success: function(res) {
                    _this.fullScreenLoadingShow = false;
                    _this.isDisable = true;
                    _this.isLoading=false;
                    if (res.code == 1) {
                        _this.creditListData.push.apply(_this.creditListData, res.data)
                        if (res.data && res.data.length > 0 && res.data.length == 10) {
                            _this.pageNum++;
                        }else{
                            _this.isDisable=false;
                        }
                        _this.reloadDataStatus=false;
                    }else{
                        _this.reloadDataStatus=true;
                    }
                },
                error:function(){
                    _this.isDisable = true;
                    _this.fullScreenLoadingShow = false;
                    _this.reloadDataStatus=true;
                }
            })
        },
    }
}
</script>
