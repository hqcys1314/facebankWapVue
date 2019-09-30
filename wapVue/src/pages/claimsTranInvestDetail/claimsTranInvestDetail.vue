<template>
  <div class="claimsTranInvestDetail">
    <div class="ctCard">
      <div class="product_name">
        {{productDetail.productName}}
        <serviceComponents class="scPos"></serviceComponents>
      </div>
      <div class="product_detail">
           <p class="p1">{{productDetail.rate}}<span>%</span></p>
           <p class="p2">原标年化</p>
           <ul>
             <li>
               <span>{{productDetail.remainDays}}</span>
               <p>剩余期限(天)</p>
             </li>
             <li>
               <span>{{productDetail.remainAmount}}</span>
               <p>出让价格(元)</p>
             </li>
             <li>
               <span>{{productDetail.discountFeeRate}}%</span>
               <p>折让率</p>
             </li>
           </ul>
       </div>
       <div class="ct_detail">
         <p>
           <span class="span1">债权价值</span><span class="span2">{{productDetail.amount}}元</span>
         </p>
         <p>
           <span class="span1">原始期限</span><span class="span2">{{productDetail.termCount}}
           {{productDetail.termUnit == 1 ? '天' : productDetail.termUnit == 3 ? '个月' : ''}}</span>
         </p>
         <p>
           <span class="span1">还款方式</span><span class="span2">{{repaymentTypeFont[productDetail.repaymentType]}}</span>
         </p>
         <p>
           <span class="span1">产品类型</span><span class="span2">{{productDetail.oriAssetType=='70'?'智能推荐':'散标'}}</span>
         </p>
         <div class="d_small">
           *出让价格=债权价值-债权价值*折让率<br>
           *本项目您出借<font>{{productDetail.remainAmount}}</font>元即可获得价值<font>{{productDetail.amount}}</font>元的债权
         </div>
       </div>
    </div>
    <div class="ctNum">
      <a class="redPacket" v-on:click="toNextPage()">
         <span class="span2">{{productDetail.creditCount}}
          </span>
        <span class="span1">债权明细
          </span>
        <i class="iconfont icon-ic_rightarrow"></i>
      </a>

      <div class="redPacket">
        <span class="span3">{{productDetail.overdueTimes}}笔</span>
        <span class="span1">历史还款逾期笔数</span>
      </div>
    </div>
    <div class="ctDesc">
      网络借贷有风险。当您/贵机构在做出接受网络借贷信息中介机构服务和出借决策之前，请仔细阅读在充分了解并清楚知晓网络借贷产品风险收益特征和产品特性，<span>认真考虑网络借贷产品存在的各项风险因素及网贷机构禁止性行为后</span>，并充分考虑自身的风险承受能力，理性判断并谨慎做出是否出借的决策。
      <br />具体内容请详见：<a href="javascript:;" @click="$refs.layerAgreement.showAgreement('riskInfo', '',true)">《网络借贷风险揭示书》</a>
    </div>
    <div style="height: 6rem;"></div>
    <div class="footBtn">
      <input type="button" value="下一步"  class="btn_tpls goInvest" v-on:click="stepOne()">
    </div>
    <layerAgreement ref="layerAgreement"></layerAgreement>

    <div class="layerMask" v-show="layerMaskStatus" v-cloak></div>
    <div class="layer_conform" v-show="layer_conform">
      <div class="layer_title">
        <a href="javascript:;" id="closeInvestLayer" class="close" @click="close()"></a>
        <div class="d1">出借金额</div><div class="d2">转让项目需全额出借</div>
      </div>
      <div class="layer_content">
        <div class="input">
          <div class="unit"></div>
          <input name="autoInvestAmount" type="number" disabled :value="productDetail.remainAmount"/>
          <a v-if="!statuCode" href="javascript:;" @click="gotoRecharge()" >去充值</a>
        </div>
        <div class="other">
          <span class="span1">预期总回报(元)</span>
          <span class="span2">{{(productDetail.remainInterest*1+productDetail.discountFee*1)|currency}}</span>
          <p class="p1">
            <span>利息&nbsp&nbsp{{productDetail.remainInterest}}元</span><span>出让人折让金额&nbsp&nbsp{{productDetail.discountFee}}元</span>
          </p>
          <p class="p2">*因债权可能随时发生还款，实际出借金额和预期总回报以实际转出时的债权价值计算</p>
        </div>
      </div>
      <input v-if="statuCode" class="btn_tpls"  type="button" @click="confirmSetp1()" value="确认出借" />
      <input v-else class="btn_tpls disabled" type="button" disabled="disabled" value="可用余额不足，无法出借" />
    </div>

    <agreementLayer
      :show.sync="showAgreementStateLayer"
      :proInfo.sync="productDetail"
      @investConfirm="investConfirm"
      @abandonSelectChange="abandonSelectChange"
    ></agreementLayer>
    <needActive :userInfo.sync="userBaseInfoResult" :show.sync="showActive" ref="needActive"></needActive>
    <smileLoading :showSmileLoading="loadingLayerStatus"></smileLoading>
    <tipLayer ref="tipLayer"></tipLayer>
    <tosat :content.sync="tosatContent" :show.sync="tosatShow" @tosatFns="tosatFn" ref="tosat"></tosat>

  </div>
</template>

<style lang="less" src="./claimsTranInvestDetail.less"></style>

<script>
  import * as constants from './claimsTranInvestDetailConstants';
  import serviceComponents from '@/components/serviceComponents';
  import agreementLayer from '@/components/discount/agreementLayer';
  import {utils} from 'tools';

  export default {
    name: constants.NAME,
    data() {
      return {
        layerMaskStatus:false,
        layer_conform:false,
        userBaseInfoResult:'',
        showActive: false,
        showAgreementStateLayer : false,
        productData : '',
        btnDisabledStatus : false,
        loadingLayerStatus:false,
        termUnit:'',
        query:'',
        tosatContent:'',
        tosatShow:false,
        stepOneDisable:false,
        productDetail:'',
        userCash:'',
        statuCode:false,
        repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],

      }
    },
    components:{serviceComponents,agreementLayer},//这里注册

    created:function () {
      this.oriOrderId = this.$route.query.oriOrderId;
      this.getProductInfo();
    },

    methods: {
      getProductInfo(){
        var _this = this;
        $.ajax({
          url : utils.AJAXDOMAINNAME+ '/wap/product/orderTransferProductDetail?&orderId='+this.oriOrderId,
          type: 'GET',
          success: function(res) {
            if (res.code == 1) {
              _this.productDetail=res.data;
              //匹配标的列表处理

              var creditIdArr = [];

              if(_this.productDetail.creditIds.length*1>0){
                creditIdArr=_this.productDetail.creditIds;
              }
              if( creditIdArr.length > 0){
                _this.$set(_this.$data.productDetail, 'creditIdArr', creditIdArr)
              }
            }else{
              _this.$refs.tipLayer.showLayer(1, res.message, '');

            }
          }
        })
      },
      toNextPage(){
        if(!utils.getUserInfo().isLogin) {
          utils.toLogin('/claimsTranInvestCreditorList?orderId='+this.oriOrderId);
        }else{
          window.location.href='/claimsTranInvestCreditorList?orderId='+this.oriOrderId;
        }
      },
      stepOne(){
        this.userBaseInfoResult=utils.getUserInfo();
        this.isLogin = this.userBaseInfoResult.isLogin;
        this.isBindCard = this.userBaseInfoResult.isBindCard;
        this.isIdValify = this.userBaseInfoResult.isIdValify;
        this.oriOrderId = this.oriOrderId;
        if(this.userBaseInfoResult.info.accountState=='350'){
          this.$refs.tipLayer.showLayer(1, '您的笑脸账号异常，请联系客服4008-900-766！', '');
          return;
        }
        if(this.userBaseInfoResult.info.accountState=='300'){
          this.$refs.tipLayer.showLayer(1, '您的账户状态异常，请联系客服4008-900-766！', '');
          return;
        }
        if (!this.isLogin) {
          utils.toLogin('/loanList');
          return false;
        }else if (!this.isIdValify) {
          this.tosatFn({
            msg : '请先完成实名',
            path: '/authentication',
            cburl : '/claimsTranInvestDetail?oriOrderId='+this.oriOrderId,
          })
        }else{
          if(!this.$refs.needActive.checkDepositoryStatus()) return false;
            if(this.productDetail.remainAmount * 1 == 0){
              this.$refs.tipLayer.showLayer(1, '当前标的已出借', '');
            }else{
              //风险等级验证
              if(this.productDetail.isSupportInvest*1 == 0){
                this.$ref.showRiskLayer(this.productDetail.riskWarningMsg, 'subject')
              }else{
                var _this=this;
                //获取用户金额
                $.ajax({
                  url : utils.AJAXDOMAINNAME+ '/wap/getAccountBalance',
                  async : false,
                  success : function(res){
                    if(res.code*1 == 1){
                      _this.userCash = res.data.accountBalance ? res.data.accountBalance : '0.00'
                    }else{
                      _this.$refs.tipLayer.showLayer(1,res.message, '');
                    }
                  }
                })
                if(this.userCash*1>=this.productDetail.remainAmount*1){
                   this.statuCode=true;
                }else {
                  this.statuCode=false;
                }
                this.layer_conform=true;
                this.layerMaskStatus=true;
              }
            }

        }

      },
      //控制风险等级浮层
      showRiskLayer(font, isSubject){
        this.riskLayerContent = font;
        this.riskLayerStatus = true;
        this.layerInputMaskShow = true;

        if(this.currentTag == 3 || this.currentTag == 1) this.layerMaskStatus = true;

      },
      //关闭风险等级浮层
      hideRiskLayer(){
        this.riskLayerContent = '';
        this.riskLayerStatus = false;
        this.layerInputMaskShow = false;
        //this.layerMaskStatus=false;
        if(this.currentTag == 3 || this.currentTag == 1) this.layerMaskStatus = false;
      },
      tosatFn(parame){
        var _this = this;
        this.$refs.tosat.tosatShow({
          msg : parame.msg,
          time : 2
        }, function(){
          utils.newWebView(parame.path +'?cburl='+parame.cburl)

        })
      },
      close(){
        this.layer_conform=false;
        this.layerMaskStatus=false;
      },
      investConfirm(){
          var _this = this;
          if(_this.btnDisabledStatus) return false;
          _this.loadingLayerStatus = true;
          _this.btnDisabledStatus = true;
         _this.layerMaskStatus=false;
          if(this.productDetail.termUnit==1){
            var ProTermV= this.productDetail.termCount+'天';
          }else if(this.productDetail.termUnit==3){
            var ProTermV= this.productDetail.termCount+'个月';
          }
          $.ajax({
            url : _this.utils.AJAXDOMAINNAME+ '/wap/product/orderTransferProduct/invest',
            data: JSON.stringify({
              orderId : _this.oriOrderId
            }),
            error : function(XMLHttpRequest, textStatus){
              _this.btnDisabledStatus = false;
              _this.netErrorHandler();
            },
            success: function(res) {
              _this.loadingLayerStatus = false;
              _this.btnDisabledStatus = false;
              if (res.code == 1) {
                var routeParame = {
                  amount: _this.productDetail.amount,
                  remainAmount:_this.productDetail.remainAmount,
                  repaymentText:_this.repaymentTypeFont[_this.productDetail.repaymentType],
                  remainDays : _this.productDetail.remainDays,
                  allInterest:_this.productDetail.remainInterest*1+_this.productDetail.discountFee*1
                }


                _this.utils.setCookie('isShowTkAward', 'false')
                var url = '/claimsTranInvestSuc?',
                  querys = [];
                for(var k in routeParame){
                  querys.push(k+'='+routeParame[k])
                }
                url = url+querys.join('&')
                window.location.href=url;

              }else if(res.code == '-893'){
                _this.tMsg=res.message;
              }else{

                _this.$refs.tipLayer.showByParame({
                  title : 'noTitle',
                  content : res.message,

                })
              }
            }
          })

      },
      confirmSetp1(){
        this.showAgreementStateLayer = true;
        this.layer_conform=false;

      },
      checkAccountState: function() {
        if (this.userBaseInfoResult.info.accountState == '350') {
          this.showTipsLayer('您的笑脸账号异常，请联系客服4008-900-766！', 'noTitle')
          return false;
        };
        if (this.userBaseInfoResult.info.accountState == '300') {
          this.showTipsLayer('您的账户状态异常，请联系客服4008-900-766！', 'noTitle')
          return false;
        };
        return true;
      },
      gotoRecharge: function() {
        if (!this.checkAccountState()) return;
        if (!this.$refs.needActive.checkDepositoryStatus()) return false;
        if (this.userBaseInfoResult.info.mobile == "") {
          this.showTipsLayer("您好，由于平台账户安全升级，为更有效保障您的资金安全，需请您去<a href='#' style='color:red;text-decoration: underline;'>https://www.facebank.cn</a>或者登录笑脸金融客户端完善个人信息，完成升级操作后再充值，谢谢您的配合！", '温馨提示', '', 'left')
          return;
        };
        this.$router.push({
          name: 'rechargeUI',
        })
      },
      showTipsLayer(msg, title, btnText, textAlign){
        this.$refs.tipLayer.showByParame({
          title : (title!='' ? title : ''),
          content : msg,
          btnText : (btnText ? btnText : '确定'),
          textAlign : textAlign
        })
      },
      abandonSelectChange(){
          this.showAgreementStateLayer = false;
          this.layer_conform=false;
          this.layerMaskStatus=false;
      },
    netErrorHandler(XMLHttpRequest, textStatus){
      this.loadingLayerStatus = false;
      if(textStatus == 'error'){
        this.utils.toastFuc('网络请求错误，请稍候重试');
      }else if(textStatus == 'timeout'){
        this.utils.toastFuc('网络请求超时，请稍候重试');
      }
    },
  },
  }
</script>
