<template>
    <div class="limitTimeBox" v-if="showData" :class="{'marginBottom' : limitType == 'autoInvest'}" @click="activeFn">
        <div class="time_tag">
            <div class="time">
                <span>{{countHours < 10 ? '0'+countHours : countHours}}</span><i></i>
                <span>{{countMinutes < 10 ? '0'+countMinutes : countMinutes}}</span><i></i>
                <span>{{countSecond < 10 ? '0'+countSecond : countSecond}}</span></div>
            <div class="tags">
                <span v-if="showData.isEnableFirstAddCash=='1'">首购返现</span>
                <span v-if="showData.activityRate*1 > 0">限时加息</span>
                <span v-if="showData.saleTags != null && showData.saleTags.length > 0 && index < 1" v-for="(it, index) in showData.saleTags">{{substrings(it, 4)}}</span>
            </div>
        </div>

        <div class="rate_box">
            <p>{{showData.rate}}<i>%</i> <i class="f2">+</i><span>{{showData.activityRate}}<i>%</i></span></p>
            <em v-if="limitType == 'deposit'">期待年化回报率</em>
            <em v-else>借款合同约定年化利率</em>
        </div>
        <div class="infos" v-if="limitType == 'deposit'">
            <p><span>{{showData.termCount}}</span>{{showData.termUnit == 1 ? '天' : showData.termUnit == 3 ? '个月' : ''}}锁定期</p>
            <p v-if="showData.remainAmount*1 > 10000">剩余<span>{{showData.remainAmount | formatNumber2}}</span>万元</p>
            <p v-else>剩余 不足<span>{{showData.remainAmount | formatNumber2}}</span>万元</p>
            <p>{{showData.termCount}}{{showData.termUnit == 1 ? '天' : showData.termUnit == 3 ? '个月' : ''}}后委托转让</p>
        </div>
        <div class="infos" v-else>
            <p><span>{{showData.termCount}}</span>{{showData.termUnit == 1 ? '天' : showData.termUnit == 3 ? '个月' : ''}}期限</p>
            <p v-if="showData.remainAmount*1 > 10000">可出借<span>{{showData.remainAmount | formatNumber2}}</span>万元</p>
            <p v-else>剩余 不足<span>{{showData.remainAmount | formatNumber2}}</span>万元</p>
            <p>{{repaymentTypeFont[showData.repaymentType]}}</p>
        </div>
        <div class="btns_area">
            <a href="javascript:;" class="btn_tpls">出借</a>
        </div>
    </div>
</template>
<script>
    export default {
      name: 'limitTime',
      props: ['limitData', 'limitType'],
      data(){
          return {
              timer : null,
              showData : '',
              countDownTimeShow : '',
              countSecond : 0,
              countMinutes : 0,
              countHours : 0,
              canToDetailPage : true,
              repaymentTypeFont : ['', '先息后本', '一次性还本付息', '等额本息'],
          }
      },
      filters : {
          formatNumber2(num){
              if(num*1<10000){
                  return '1';
              }else{
                  var nums = new Number(num)
                  //num = nums.toLocaleString()
                  return parseInt((num/10000)*100)/100;
              }
          }

      },
      created:function(){

      },
      mounted:function(){

      },
      methods:{
          //获取字符长度
          len : function(s){
                if(!s) return '';
                var l = 0;
                var a = s.split("");
                for (var i=0;i<a.length;i++) {
                    if (a[i].charCodeAt(0)<299){
                        l++;
                    }else{
                        l+=2;
                    }
                };
                return Math.ceil(l/2);
            },
          substrings(val, len){
              if(!val) return;
              var lastVal = this.len(val) > len ? (val.substring(0,len) + '...') : val.substring(0,len)
              return lastVal;
          },
          stopTimer(){
              window.clearInterval(this.timer);
          },
          countDown(){
              var _this = this;
              if(_this.time == 0) return;
              _this.timer = setInterval(function(){
                  _this.time--;
                  if(_this.time <= 0){
                      _this.$set(_this.$data.showData, 'remainTime', 0)
                      window.clearInterval(_this.timer);
                      _this.$emit('timeOverFn','')
                      return;
                  }else{
                      _this.$set(_this.$data.showData, 'remainTime', _this.time);
                      _this.countHours = parseInt(_this.time/(60*60));
                      _this.countMinutes = parseInt(_this.time/60)%60;
                      _this.countSecond = _this.time%60;
                  }
              },1000)
          },
          toDetail(listItem){
              this.utils.setCookie('currentId', '', -1);
              var _this = this;
              if(!this.canToDetailPage) return false;
              this.canToDetailPage = false;


              setTimeout(function(){
                  _this.canToDetailPage = true;
                  _this.utils.newWebView('/timeDepositDetail?id='+_this.showData.productId, 'noRefresh')
              },320)

          },
          activeFn(){
              if(this.limitType == 'deposit'){
                  this.toDetail();
              }else if(this.limitType == 'autoInvest'){
                  this.$parent.selectAutoInvestItem(this.showData.configId, this.showData.repaymentType, this.showData)
              }
          }
      },
      watch:{
          limitData : function(val){
              this.stopTimer();
              this.showData = this.limitData;
              this.time = this.showData.activityRemainTime*1 > 0 ? parseInt((this.showData.activityRemainTime*1)) : 0;
              this.countDown();
          }
      }
    }
</script>
<style scoped>
.limitTimeBox{background:#FFFFFF;padding-left:1rem;height:auto;overflow:hidden;padding-bottom:1rem;margin-top:.625rem;}
.limitTimeBox.marginBottom{margin-bottom:.625rem;}
.limitTimeBox .time_tag{border-bottom:1px solid #DFE3EB;height:2.75rem;line-height:2.75rem;background:url(~assets/images/limit_time_1.png) no-repeat center left/auto 1rem;padding-left:5.09375rem;margin-bottom:1.75rem;}
.limitTimeBox .time{width:5.15rem;float:left;height:1rem;margin-top:.875rem;}
.limitTimeBox .time span{padding:0 .22rem;min-width:1rem;float:left; white-space: nowrap; text-align:center;line-height:1rem;font-size:.75rem;color:#FFFFFF;background:url(~assets/images/limit_time_2.png) no-repeat center center/100% 100%;}
.limitTimeBox .time i{height:1rem;overflow:hidden;width:.25rem;float:left;display:block;background:url(~assets/images/limit_time_3.png) no-repeat center center/100% 100%;}
.limitTimeBox .tags span{float:left;margin-left:.4375rem;margin-top:.9375rem;border-radius:.5rem;padding:0 .375rem;line-height:1rem;font-size:.625rem;color:#B88A2D;background:#FDF2E5;}
.limitTimeBox .rate_box{display:block;text-align:center;margin-bottom:1.5rem;font-size:0.6875rem;color:#848999;margin-right:1rem;}
.limitTimeBox .rate_box em{font-style:normal;}
.limitTimeBox .rate_box p{font-size:2.45rem;line-height:2.5rem;height:2.5rem;overflow:hidden;color:#F0484E;margin-bottom:.25rem;font-weight:600}
.limitTimeBox .rate_box p i{font-style:normal;font-size:1rem;}
.limitTimeBox .rate_box p span{font-size:2rem;}
.limitTimeBox .infos{height:auto;overflow:hidden;margin-right:1rem;}
.limitTimeBox .infos p{width:33.33%;float:left; white-space:nowrap;font-size:.75rem;margin-bottom:1.5rem;text-align:center;}
.limitTimeBox .infos p span{color:#2F323D;font-weight:600;;}
.limitTimeBox .btns_area{margin-right:1rem;}
.limitTimeBox .btn_tpls{width:19.4375rem;}
</style>
