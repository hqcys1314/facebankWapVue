<template>
  <div id="directRecordDetail" v-cloak>
  	<div class="directRecordDetail">

        <div class="switch_tab">
            <ul>
          <li v-on:click="listTab(1)" v-bind:class="{current : tabIndex_1}"
          class="sensors-btn" sensors-name="直投列表_直投详情_出借信息">出借信息</li>
          <li v-on:click="listTab(2)" v-show="hasInterest" v-bind:class="{current : tabIndex_2}"
          class="sensors-btn" sensors-name="直投列表_直投详情_债权明细">债权明细</li>
        </ul>
    </div>
        <div v-show="tabIndex_1">
          <!--我的出借-->
          <div class="item_box">
            <div class="title">我的出借</div>
            <div class="item_dl">
              <dl>
                <dt>出借日期</dt>
                <dd>{{detailData.investDate}}</dd>
              </dl>
              <dl>
                <dt>{{hasInterest ? '成功出借金额' : '出借金额'}} </dt>
                <dd>
                    {{detailData.investAmount && (detailData.investAmount - detailData.failCreditAmount)}}元
                    <small v-if="detailData.failCreditAmount > 0">*您出借{{detailData.investAmount}}元，部分借款标的放款失败导致流标退款。未成交金额({{detailData.failCreditAmount}}元)已退回至您的账户中</small>
  				  <small v-else-if="detailData.loanTransferOrder*1 == 1">*以实际匹配的债权本金为准</small>
  				  <small v-else>*以放款起息时实际出借成功金额为准</small>
                </dd>
              </dl>
              <dl>
                <dt>预期总回报</dt>
                <dd v-if="hasInterest">
                    {{detailData.investTotalProfit}}元<span v-cloak v-if="hasInterest && detailData.rewardList && detailData.rewardList.length > 0" class="gift" @click="showShouyiLayer">{{detailData.rewardList && detailData.rewardList.length}}个奖励</span>
  				  <small v-if="hasInterest">*预期总回报按放款起息时成功出借金额计算（日后可能会因为某些标的提前还款导致预期利息有波动）。</small>
  				  <small v-else>*实际结果按放款起息时成功出借金额计算</small>
                </dd>
  			  <dd v-else>--</dd>
              </dl>
              <dl>
                <dt>出借协议</dt>
                <dd><span v-if="hasInterest"><a v-bind:href="detailData.investContract"
                    >查看</a></span><span v-else><a href="javascript:;">起息后生成</a></span></dd>
              </dl>
              <dl>
                <dt></dt>
                <dd></dd>
              </dl>
            </div>
          </div>
          <!--还款进度-->
          <div class="item_box">
            <div class="title">还款进度</div>
            <div class="progress_box">
              <div class="progress_bar">
                <div class="line"></div>
                <div class="bar" v-bind:style="progressPP">
                  <div class="line"></div><div class="dian"></div>
                </div>
                <div class="text"><span>待还本息：{{detailData.waitToCollectPrincipalAndProfit || '0.00'}}元</span>已还本息：{{detailData.hasRepayTotalAmount || '0.00'}}元</div>
              </div>
              <div class="progress_bar">
                <div class="line"></div>
                <div class="bar" v-bind:style="progressPrincipal">
                  <div class="line"></div><div class="dian"></div>
                </div>
                <div class="text"><span>待还本金：{{detailData.waitToCollectPrincipal || '0.00'}}元</span>已还本金：{{detailData.hasRepayPrincipal || '0.00'}}元</div>
              </div>
              <div class="progress_bar">
                <div class="line"></div>
                <div class="bar" v-bind:style="progressProfit">
                  <div class="line"></div><div class="dian"></div>
                </div>
                <div class="text"><span>待还利息：{{detailData.waitToCollectProfit || '0.00'}}元</span>已还利息：{{detailData.hasRepayProfit || '0.00'}}元</div>
              </div>
            </div>
          </div>

          <!--我的出借-->
          <div class="item_box">
            <div class="title">项目信息</div>
            <div class="item_dl style2">
              <dl>
                <dt>项目名称</dt>
                <dd>{{detailData.productName}}</dd>
              </dl>
              <dl>
                <dt>项目状态</dt>
                <dd v-bind:class="stateClass">{{orderState[detailData.orderState]}}</dd>
              </dl>
              <dl>
                <dt>期限</dt>
                <dd>{{detailData.orderDeadLine}}</dd>
              </dl>
              <dl>
                <dt>借款合同约定年化利率</dt>
                <dd>{{detailData.orderRate}}%<small v-if="detailData.repayIntType == 2">*年化利率不代表实际回报。在等额本息情况下，若想获得更多利息，建议您每月收到回款后立即循环出借</small></dd>
              </dl>
              <dl>
                <dt>还款方式</dt>
                <dd>{{detailData.repayType}}</dd>
              </dl>
              <dl v-if="detailData.borrowOrganization != ''">
                <dt>助贷机构</dt>
                <dd>{{detailData.borrowOrganization}}</dd>
              </dl>

            </div>
          </div>

          <services showItem="online, feedback" :rid="orderId" sourceType="bulk-standard-order"></services>
        </div>
        <div v-show="tabIndex_2">
            <ul class="list-type-1">
              <li v-for="(item, index) in investSeparateCreditList"
              v-on:click="gotoPage(item)" class="sensors-btn" sensors-name="直投列表_查看债权详情">
                <div class="info"><span style="display:none" v-bind:class="item.loanState == '100' ? 'state_1' : 'state_2'">{{item.loanState == '100' ? '还款中' : '已还清'}}</span>编号：{{item.creditId}}</div>
                <div class="user_info">
                  <p>{{item.borrowerName}}<small>借款人</small></p>
                  <p>{{item.amount || '0.00'}}<small>借款金额(元)</small></p>
                  <p>{{item.loanState == '100' ? '还款中' : '已还清'}}<small>标的状态</small></p>
                </div>
              </li>
            </ul>
            <div class="more sensors-btn" v-on:click="getUserInvestSeparateCreditList()" v-show="showLoadMore"
            sensors-name="债权列表-点击加载更多">点击加载更多 >></div>
        </div>
      </div>
  	<div class="wapMc" v-show="wapMcStatus" style="display:block">
  	</div>
  	<div class="wapPos" v-show="shouyiStatus" style="display:block">
  		<div class="wapTip">
  			<div class="div-value">
  				<p v-for="item in detailData.rewardList">
  					{{item.title}}<span class="span-right"><font>{{item.rewardAmount}}</font>元</span>
  				</p>
  			</div>
  			<p class="p3" v-on:click="hideShouyiLayer()">
  				知道了
  			</p>
  		</div>
  	</div>
  </div>
</template>

<style scoped src="./directRecordDetail.css">
</style>

<script>
import * as constants from './directRecordDetailConstants';
import {utils,globalVariable} from'tools'

export default {
  name: constants.NAME,
  data () {
    return {
    tabIndex_1 : true,
 	  tabIndex_2 : false,

 	  orderId: '',
 	  //当前出借信息
 	  getUserInvestSeparateOrderDetailUrl : '/wap/getUserInvestSeparateOrderDetail',
 	  //当前出借信息数据
 	  detailData : '',
 	  //债权列表
 	  getUserInvestSeparateCreditListUrl : '/wap/order/oldCreditList',
 	  //债权列表页码
 	  pageNum : 1,
 	  //债权列表数据
 	  investSeparateCreditList : [],
 	  showLoadMore : false,

 	  shouyiStatus:false,
 	  wapMcStatus : false,

 	  //是否已起息
 	  hasInterest : false,
 	  stateClass : 'state_',
 	  orderState : ['系统出借中','计息中','已结清'],

 	  //还款进度
 	  progressProfit : '0%',
 	  progressPrincipal : '0%',
 	  progressPP : '0%'

    }
  },
  components:{},//这里注册
  created:function () {
      this.orderId = this.$route.query.orderId;
      this.getUserInvestSeparateOrderDetail();
      this.getUserInvestSeparateCreditList();
  },
  mounted(){

  },
  computed: {

  },
  methods: {
    //tab键切换
    listTab:function(num) {
        if (num == 1) {
            this.tabIndex_1=true;
            this.tabIndex_2=false;
        } else {
            this.tabIndex_1=false;
            this.tabIndex_2=true;
        }
    },
	showShouyiLayer : function(){
		this.shouyiStatus = true;
		this.wapMcStatus = true;
	},
	hideShouyiLayer : function(){
		this.shouyiStatus = false;
		this.wapMcStatus = false;
	},
    getUserInvestSeparateOrderDetail:function(){
		   var _this = this;

        $.ajax({
			 url : utils.AJAXDOMAINNAME+ _this.getUserInvestSeparateOrderDetailUrl,
			  data : '{"orderId":"'+ _this.orderId +'","creditId":""}',
			  success : function(res){
				  if(res.code==1){
					  _this.detailData = res.data;
		              var detailData = _this.detailData;

		              _this.hasInterest = detailData.orderState != '0'
		              _this.stateClass = 'state_' + detailData.orderState;
		              var pp = parseFloat(detailData.hasRepayTotalAmount || 0, 10),
		                  wantPp = parseFloat(detailData.waitToCollectPrincipalAndProfit || 0, 10),
		                  profit = parseFloat(detailData.hasRepayProfit || 0, 10),
		                  wantProfit = parseFloat(detailData.waitToCollectProfit || 0, 10),
		                  principal = parseFloat(detailData.hasRepayPrincipal || 0, 10),
		                  wantPrincipal = parseFloat(detailData.waitToCollectPrincipal || 0, 10);

		              _this.progressPP = 'width:' + (pp + wantPp > 0 ? parseInt((pp / (pp + wantPp)).toFixed(2) * 100) : 0) + '%';
		              _this.progressProfit = 'width:' + (profit + wantProfit > 0 ? parseInt((profit / (profit + wantProfit).toFixed(2)) * 100) : 0) + '%';
		              _this.progressPrincipal = 'width:' + (principal + wantPrincipal > 0 ? parseInt((principal / (principal + wantPrincipal).toFixed(2)) * 100) : 0) + '%';
				  }
			  }
		})
    },
    getUserInvestSeparateCreditList:function(){
		    var _this = this;
        $.ajax({
			 url : utils.AJAXDOMAINNAME+ _this.getUserInvestSeparateCreditListUrl,
			  data : '{"orderId":"'+_this.orderId+'","pageNum":'+_this.pageNum+'}',
			  success : function(res){
				  if(res.code==1){
					  res.data.creditList.map(function(item){
	                      _this.investSeparateCreditList.push(item)
	                  })
					  if(res.data.creditList.length > 0 && res.data.creditList.length == 10){
	                    _this.pageNum++;
	                    _this.showLoadMore = true;
	                  }else if(res.data.creditList.length < 10){
	                    _this.showLoadMore = false;
	                  }
				  }
			  }
		})

    },
    gotoPage: function (item) {
    	window.location.href="/directRecordDebtDetailOld?creditId=" + item.creditId + "&orderId=" + this.orderId+ '&investContract='+item.investContract;
    }
  }
}

</script>
