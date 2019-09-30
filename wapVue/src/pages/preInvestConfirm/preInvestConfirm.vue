<template>
    <div id="preInvestConfirm" v-cloak>
          <div class="ofc-content">
              <div class="ofc-content-detail">
                  <div class="div-detail-title">
                      <div class="div-text">{{product.productName }}</div>
                  </div>
                  <div class="div-detail-number">
                       ¥{{preInvestAmount | toFixed}}
                  </div>
                  <div class="div-detail-number-name">转投金额</div>
              </div>
              <div class="ofc-content-tip">
                  <div class="right">实际收益以转投生效为准<img src="~assets/wapFront/common/img/tip_i.png" class="span2" v-on:click="tipShow()">
                  </div>
                  <div class="left">
                      预期收益<span class="span1"><font>{{allInterest | toFixed}}</font>元</span>
                      <img src="~assets/wapFront/common/img/tip_i.png" class="span2" v-on:click="shouyiTip()">
                  </div>
              </div>
          </div>
          <div class="redPacket">
                	<span class="span5"><img src="~assets/wapFront/invest/img/nid_youjiantou.png"></span>
                  <span class="span4" v-on:click="chooseRedbagShow()">
                  	<font class="font1">x</font><font class="font2">x</font>
                  </span>
                  <span class="span1">红包优惠</span>
                  <span class="span7" v-if="abledRedPkgsCount > 0">共</span><span class="span6">{{abledRedPkgsCount}}</span><span class="span7">个</span>
                  <span class="span7" v-if="abledRedPkgsCount== 0">无可用红包</span>
          </div>
          <div class="inv-confirm-btn">
              <input type="button" value="预约转投" class="btn_tpls" id="preInvestBtn">
          </div>
          <div class="inv-confirm-xieyi">
              <input type="checkbox" checked="checked" id="cbLoanContract">
              <span>本人已仔细阅读
                <router-link :to="{ path: '/showRegularProductContract', query: {statisticssign:statisticssign,relationType:'1',relationId:encryptProductId} }"
                >
                《定存计划委托合同》
                </router-link>
              </span>
          </div>
          <div class="redbagTk" v-show="redbagTkStatus" v-if="product.remark==''">
              	<div class="title"><img src="~assets/wapFront/invest/img/title.png" /></div>
                <div v-for="(redPkg,index) in abledRedPkgs" v-if="investAmount >= redPkg.subtract" v-on:click="chooseRedBag(index)">
                  		<div class="rb_jiaxi rb_com" v-if="redPkg.type_id == 2">
                  				<div class="left">{{redPkg.rate}}<font>%</font></div>
                  				<div class="center"><p class="p1">加息红包</p><p class="p2">{{redPkg.end_time.substring(0,10)}}到期</p></div>
                  				<div class="right" ><img src="~assets/wapFront/autoInvest/img/weixuanzhong.png" /></div>
                  		</div>
                  		<div class="rb_fanxian rb_com" v-if="redPkg.type_id == 1">
                  				<div class="left">{{redPkg.amount}}<font>元</font></div>
                  				<div class="center"><p class="p1">返现红包</p><p class="p2">{{redPkg.end_time.substring(0,10)}}到期</p></div>
                  				<div class="right"><img src="~assets/wapFront/autoInvest/img/weixuanzhong.png" /></div>
                  		</div>
                </div>
              	<div class="rb_wu rb_com">
              		<div class="left">不使用红包</div>
              		<div class="center">&nbsp;</div>
              		<div class="right"><img src="~assets/wapFront/autoInvest/img/weixuanzhong.png" /></div>
              	</div>
          </div>

          <div class="wapMc" v-show="wapMcStatus">
          </div>
          <div class="wapPos" v-show="expectedReturnShowStatus">
              <div class="wapTip">
                  <div class="div-title">
                      预期收益：<font>{{allInterest}}</font>元
                  </div>
                  <div class="div-value">
                      <p>基本收益({{product.rate}}%)<span class="span-right"><font>{{basicInvestInterest}}</font>元</span></p>
                      <p v-if="redType=='加息红包'">加息红包收益({{redRate}}%)<span class="span-right"><font>{{redBagInterest}}</font>元</span></p>
                      <p v-if="redType=='返现红包'">返现红包收益<span class="span-right"><font>{{redAmountInterest}}</font>元</span></p>
                      <p>{{vipInterestMap.vipLevel}}会员加息收益({{vipInterestMap.vipRate}}%)
                        <span class="span-right">
                          <font>{{vipInterestMap.expectedVipInterest}}</font>元</span>
                        </p>
                  </div>
                  <div class="div-rule">
                      <ul>
                          <li>1. “会员加息”可能会因转投生效时会员等级的上升而向上浮动；</li>
                          <li>2. 当转投生效时符合“首购加息”条件，则享受“首购加息”；</li>
                          <li>3. 本次转投的实际年化收益率以转投生效为准。</li>
                      </ul>
                  </div>
                  <p class="p3" v-on:click="closeTk()">
                      知道了
                  </p>
              </div>
          </div>
          <!-- 转投生效弹框 -->
          <wapTk2 v-bind:iswapTkShow2="wapTkStatus2" v-bind:pLeft2="pLeft2" v-on:close="wapTkClose()"></wapTk2>
  </div>
</template>
<style scoped src="./preInvestConfirm.css">
</style>
<script>
    import {wapTk2} from 'components'
    export default {
      name: 'preInvestConfirm',
      data () {
            return {
              product:'',
              vipInterestMap:'',
              redType:'加息红包',
              redValue:'',
              redRate:'',//加息红包利率
              redAmount:'',//返现红包金额
              vipRate:'',
              pLeft2:'',
              wapMcStatus:false,
              wapTkStatus2:false,
              redbagTkStatus:'',
              statisticssign:'',
              encryptProductId:'',
              abledRedPkgsCount:'0',//可用红包
              totalRedPkgsCount:'12',//所有红包
              abledRedPkgs:'',
              redBagInterest:'',//加息红包
              firstInterestValue:'',//收益加息
              redAmountInterest:'',//返现红包
              allInterest: '11111',
              preInvestAmount: '111111',
              basicInvestInterest:'',
              repaymentDate:'1',
              expectedReturnShowStatus:'',
              loadingJsonUrl:'/wap/preInvestConfirm',
            }
        },
        components:{wapTk2},//这里注册
        created:function () {
              this.$http.get(this.loadingJsonUrl).then(function(res){
                      if ((res.data != null) && (res.data != "")){
                          this.productList=eval(res.data);
                          this.$options.methods.dateChange.bind(this)();
                      }

              },function(res){
                          console.warn(res);
              });

        },
        methods: {

          //选择红包
          chooseRedBag:function(index){
              this.redbagTkStatus=false;
              this.wapMcStatus=false;
              if(this.abledRedPkgs[index].type_id ==1){
                      this.redType="返现红包";
                      this.yyy=this.abledRedPkgs[index].amount;
              }
              if(this.abledRedPkgs[index].type_id ==2){
                      this.redType="加息红包";
                      this.yyy=this.abledRedPkgs[index].rate;
              };

          },
          dateChange:function(){
            if(this.abledRedPkgs==null||this.abledRedPkgs == ""){
              this.abledRedPkgs="{}";
            }
            var redType = "";
          	var redRate = 0;
          	var redRateEndTime = "";
          	var redRateId = "";
          	var redAmount = 0;
          	var redAmountEndTime = "";
          	var redAmountId = "";

            for (var rm in this.abledRedPkgs) {
                 //获取可用红包个数
                 this.abledRedPkgsCount++;
                 //所有的加息红包排序
                 if(this.abledRedPkgs[rm].type_id == 2){
                     if(redRate < this.abledRedPkgs[rm].rate){
              					redRate = this.abledRedPkgs[rm].rate;
              					redRateId = this.abledRedPkgs[rm].id;
              					redRateEndTime = this.abledRedPkgs[rm].end_time.substring(0,10);
              				}else if(redRate == this.abledRedPkgs[rm].rate){
              					var newRateEndTime = this.abledRedPkgs[rm].end_time.substring(0,10);
              					if(Date.parse(redAmountEndTime) < Date.parse(newRateEndTime)){
              						redRate = this.abledRedPkgs[rm].rate;
              						redRateId = this.abledRedPkgs[rm].id;
              						redRateEndTime =  newRateEndTime;
              					}
              				}
                 }
                //所有的返现红包排序
                 else if (this.abledRedPkgs[rm].type_id == 1) {
                   if(redAmount <= this.abledRedPkgs[rm].amount){
            					redAmount = this.abledRedPkgs[rm].amount;
            					redAmountId = this.abledRedPkgs[rm].id;
            					redAmountEndTime = this.abledRedPkgs[rm].end_time.substring(0,10);
            				}else if(redAmount == this.abledRedPkgs[rm].amount){
            					var newAmountEndTime = this.abledRedPkgs[rm].end_time.substring(0,10);
            					if(Date.parse(redAmountEndTime) < Date.parse(newAmountEndTime)){
            						redAmount = this.abledRedPkgs[rm].amount;
            						redAmountId = this.abledRedPkgs[rm].id;
            						redAmountEndTime = newAmountEndTime;
            					}
            				}
                 }
                 //优先使用加息红包
                 if(redRate>0){
                    this.redRate=redRate;
                    //已选中加息红包展示
                    this.redValue="+"+redRate+"%";
                 }else {
                    this.redAmount=redAmount;
                    //已选中返现红包展示
                    this.redValue="+"+redAmount+"元";
                 }

            }
            //基本收益
            var basicInterest=(this.newOrder.basicInterest).toFixed(2);
            if(basicInterest==null || basicInterest == ""){
                basicInterest = 0;
            }else{
                basicInterest = basicInterest * 1;
            }
            //VIP收益
            var vipInterest=(this.vipInterestMap.expectedVipInterest).toFixed(2);
            if(vipInterest==null ||vipInterest == ""){
                 vipInterest = 0;
            }else{
                 vipInterest =  this.vipInterest * 1;
            }

            if(this.product.termUnit==1){
                //红包收益
                if(this.redType == "返现红包"){
            			this.redAmountInterest = this.redAmount;
            		}else if(this.redType == "加息红包"){
            			this.redBagInterest = (this.investAmount * this.product.termCount *this.redRate / 36500).toFixed(2);
            		}
            }else if(this.product.termUnit==3){
                //红包收益
                if(this.redType == "返现红包"){
                  this.redAmountInterest = this.redAmount;
                }else if(this.redType == "加息红包"){
                  this.redBagInterest = (this.investAmount * this.product.termCount *this.redRate / 36500).toFixed(2);
                }
            }
            //计算总收益
            this.allInterest =  basicInterest+vipInterest+this.redBagInterest+this.redAmountInterest;

          },
          chooseRedbagShow:function(index){
            this.redbagTkStatus=true;
            this.wapMcStatus=true;
          },
          tipShow:function(){
               this.pLeft2="转投生效时间"+this.repaymentDate;
               this.wapTkStatus2=true;
          },
          shouyiTip:function(){
            this.expectedReturnShowStatus=true;
            this.wapMcStatus=true;
          },
          closeTk:function(){
            this.expectedReturnShowStatus=false;
            this.wapMcStatus=false;
          },
          //弹框关闭
          wapTkClose:function(){
              this.wapTkStatus2=false;
          },

          format:function(shijianchuo){
             //shijianchuo是整数，否则要parseInt转换
             var time = new Date(shijianchuo);
             var y = time.getFullYear();
             var m = time.getMonth()+1;
             var d = time.getDate();
             var h = time.getHours();
             var mm = time.getMinutes();
             var s = time.getSeconds();
             return y+'-'+add(m)+'-'+add(d)+' '+add(h)+':'+add(mm);
          }
          }
        }
   function add(m){return m<10?'0'+m:m }
</script>
