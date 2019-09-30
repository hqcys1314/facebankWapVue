<template>
    <div class="debtDetail" v-cloak>
  	<ul class="switch_tab">
  		<li v-on:click="listTab(1)" :class="{current : curTabId == 1}" class="sensors-btn" sensors-name="债权详情_出借信息">出借信息</li>
  		<li v-on:click="listTab(2)" :class="{current : curTabId == 2}" class="sensors-btn" sensors-name="债权详情_还款计划">还款计划</li>
  		<li v-on:click="listTab(3)" :class="{current : curTabId == 3}" class="sensors-btn" sensors-name="债权详情_标的详情">标的详情</li>
  	</ul>
  	<div v-if="curTabId == 1">
  		<div class="item_box">
  			<div class="title">出借信息</div>
  			<div class="item_dl">
  				<dl>
  					<dt>出借时间</dt>
  					<dd>{{detailData.createTime}}</dd>
  				</dl>
  				<dl>
  					<dt>出借金额</dt>
  					<dd>{{amount}}元</dd>
  				</dl>
  				<dl>
  					<dt>标的状态</dt>
  					<dd>{{bizStatus*1 == 200 ? '已还清' : bizStatus*1 == 300 ? '已转出' : '还款中'}}</dd>
  				</dl>
  				<dl>
  					<dt>已还本金</dt>
  					<dd>{{creditRepaymentPlans.repayedPrincalAmount}}元</dd>
  				</dl>
  				<dl>
  					<dt>已还利息</dt>
  					<dd>{{creditRepaymentPlans.repayedInterestAmount}}元</dd>
  				</dl>
  				<dl>
  					<dt>待还本金</dt>
  					<dd>{{creditRepaymentPlans.repayingPrincalAmount}}元</dd>
  				</dl>
  				<dl>
  					<dt>待还利息</dt>
  					<dd>{{creditRepaymentPlans.repayingInterestAmount}}元</dd>
  				</dl>
  				<dl>
  					<dt>资金使用情况</dt>
  					<dd>已用于{{loanDetail.borrowerUseName}}</dd>
  				</dl>
  				<dl>
  					<dt>协议</dt>
  					<dd>
                        <span v-for="t in creditRepaymentPlans.investContract"><a :href="t.url">{{t.name}}</a></span>
                    </dd>
  				</dl>
  			</div>
  		</div>
  	</div>
  	<div v-if="curTabId == 2">
  		<div class="item_box bottom">
  			<div class="title title2">还款计划</div>
  			<div class="content">
  				<table width="100%" border="0" cellspacing="0" cellpadding="0">
  					<thead>
  						<tr>
  							<th>期数</th>
  							<th>理论还款日</th>
  							<th>还款本金</th>
  							<th>还款利息</th>
  							<th>状态</th>
  							<th>实际还款日</th>
  						</tr>
  					</thead>
  					<tbody>
  						<tr v-for="(item, index) in creditRepaymentPlans.repaymentList">
  							<td>{{item.repayBatch}}</td>
  							<td>{{item.repayPredictDate.replace('00:00:00', '')}}</td>
  							<td>{{item.repayPrincipal}}</td>
  							<td>{{item.repayInterest}}</td>
  							<td class="small2" v-if="item.repayState == '100'">未还款</td>
  							<td class="small2" v-if="item.repayState == '200'">已还款</td>
  							<td class="small2" v-if="item.repayState == '300'">已转出</td>
  							<td class="small2" v-if="item.repayState == '400'">提前还款</td>
  							<td>{{item.repayDate}}&nbsp;</td>
  						</tr>
  					</tbody>
  				</table>
  			</div>
  			<div class="title title3">Q 实际还款日是否会与理论还款日不一致</div>
  			<div class="content content2"> A 由于银行结算时间的原因，实际还款日为理论还款日当天或理论还款日的下一个工作日 </div>
  			<p class="q">Q 借款人会发生提前还款吗？</p>
  			<p>A 借款人有能力一次性清偿债务的话，可以发起提前还款。提前还款金额 = 待收本金 + (提前还款日 - 上期还款日) / （本期还款日 - 上期还款日）x 本期利息<br><br>注：如第一期发生提前还款，则上期还款日取起息日</p>
  			<div class="blank90"></div>
  		</div>
  	</div>
  	<div v-if="curTabId == 3">
  		<div class="item_box">
  			<div class="title">标的信息</div>
  			<div class="item_dl">
  				<dl>
  					<dt>助贷机构</dt>
  					<dd>{{loanDetail.channelName}}</dd>
  				</dl>
  				<dl>
  					<dt>标的编号</dt>
  					<dd>{{loanDetail.loanNum}}</dd>
  				</dl>
  				<dl>
  					<dt>借款用途</dt>
  					<dd>{{loanDetail.borrowerUseName}}</dd>
  				</dl>
  				<dl>
  					<dt>借款金额</dt>
  					<dd>{{loanDetail.amount}}元</dd>
  				</dl>
  				<dl>
  					<dt>借款期限</dt>
  					<dd>{{loanDetail.termCount}}{{termUnit[loanDetail.termUnit]}}</dd>
  				</dl>
  				<dl>
  					<dt>还款方式</dt>
  					<dd v-if="loanDetail.productType==1">{{repaymentTypeFont[loanDetail.productType]}}(利息=订单金额*标的年化利率*期限(月)/12)</dd>
  					<dd v-else-if="loanDetail.productType==2">{{repaymentTypeFont[loanDetail.productType]}}(到期总还款额=借款本金+借款本金*出借天数*年利率/365)</dd>
  					<dd v-else="loanDetail.productType==3||loanDetail.productType==5">{{repaymentTypeFont[loanDetail.productType]}}<img style="width:100%;" src="https://static.facebank.cn/static/wapFront/invest/img/dengegongshi.png"></dd>
  				</dl>
  				<dl>
  					<dt>申请时间</dt>
  					<dd>{{loanDetail.applyDate}}</dd>
  				</dl>
  				<dl>
  					<dt>募集开始时间</dt>
  					<dd>{{loanDetail.raiseStartDate}}</dd>
  				</dl>
  				<dl>
  					<dt>募集终止时间</dt>
  					<dd>{{loanDetail.raiseEndDate}}</dd>
  				</dl>
  				<dl v-if="loanDetail.fullLoanDate!=null">
  					<dt>满标时间</dt>
  					<dd>{{loanDetail.fullLoanDate}}</dd>
  				</dl>
  				<dl>
  					<dt>起息日</dt>
  					<dd>{{loanDetail.startInterestDate }}</dd>
  				</dl>
  				<dl>
  					<dt>借款简介</dt>
  					<dd>借款人于{{formatDate(loanDetail.applyDate)}}借款用于{{loanDetail.borrowerUseName}}</dd>
  				</dl>
  				<dl>
  					<dt>截止借款前6个月内借款人征信报告中的逾期情况</dt>
  					<dd>{{loanDetail.creditOverdueCount}}</dd>
  				</dl>
  				<dl>
  					<dt>借款人在其他借款平台的借款情况</dt>
  					<dd>{{loanDetail.otherPlatformBorrowCount}}</dd>
  				</dl>
  				<dl style="display:none;">
  					<dt>底层借款利率</dt>
  					<dd>{{loanDetail.actualRate}}</dd>
  				</dl>
  				<dl>
  					<dt>逾期罚息（利率）</dt>
  					<dd>{{loanDetail.overdueInterest}}</dd>
  				</dl>
  				<dl>
  					<dt>各类服务费</dt>
  					<dd>{{loanDetail.otherFee}}</dd>
  				</dl>
  				<dl>
  					<dt>还款来源</dt>
  					<dd>{{loanDetail.sourceOfRepayment}}</dd>
  				</dl>
  				<dl>
  					<dt>项目风险评估结果</dt>
  					<dd>{{loanDetail.riskGradeName}}<span class="small">注：{{loanDetail.riskResult }}</span></dd>
  				</dl>
  				<dl v-if="loanDetail.riskType!=null&&loanDetail.riskType!=''">
  					<dt>经风险评估，该项目您的出借金额上限</dt>
  					<dd>{{loanDetail.amountLimit}}<span class="small">注：根据您的风险类型（{{loanDetail.riskType}}），为您计算您可出借至此标的的最高限额。</span></dd>
  				</dl>
  				<dl>
  					<dt>担保措施</dt>
  					<dd>{{loanDetail.guaranteeMethod }}</dd>
  				</dl>
  			</div>
  		</div>
  		<div class="item_box">
  			<div class="title">借款人信息</div>
  			<!-- borrowerType 1 个人 , 2 企业 -->
  			<div class="item_dl" v-if="loanDetail.borrowerType==1">
  				<dl>
  					<dt>借款主体性质</dt>
  					<dd>自然人</dd>
  				</dl>
  				<dl>
  					<dt>姓名</dt>
  					<dd>{{loanDetail.borrowerName}}</dd>
  				</dl>
  				<dl>
  					<dt>身份证号码</dt>
  					<dd>{{loanDetail.borrowerIdcard}}</dd>
  				</dl>
  				<dl>
  					<dt>手机号码</dt>
  					<dd>{{loanDetail.borrowerPhone}}</dd>
  				</dl>
  				<dl>
  					<dt>行业</dt>
  					<dd>{{loanDetail.borrowerPosition}}</dd>
  				</dl>
  				<dl>
  					<dt>年龄</dt>
  					<dd>{{loanDetail.borrowerAge}}</dd>
  				</dl>
  				<dl style="display:none">
  					<dt>居住城市</dt>
  					<dd>{{loanDetail.borrowerAddress}}</dd>
  				</dl>
  				<dl>
  					<dt>收入</dt>
  					<dd>{{loanDetail.borrowerIncome}}</dd>
  				</dl>
  				<dl>
  					<dt>负债情况</dt>
  					<dd>{{loanDetail.currentDebt}}</dd>
  				</dl>
  				<dl>
  					<dt>历史借款情况</dt>
  					<dd>{{loanDetail.historyRepaymentDetail}}</dd>
  				</dl>
  				<dl>
  					<dt>平台借款金额</dt>
  					<dd>{{loanDetail.borrowerRepayingTotalAmount}}</dd>
  				</dl>
  				<dl>
  					<dt>限额管理</dt>
  					<dd>{{loanDetail.limitManagement}}</dd>
  				</dl>
  				<dl>
  					<dt>在本平台逾期次数</dt>
  					<dd>{{loanDetail.overdueTotalTimes}}</dd>
  				</dl>
  				<dl>
  					<dt>在本平台逾期金额</dt>
  					<dd>{{loanDetail.overdueTotalAmount}}</dd>
  				</dl>
  				<dl v-if="detailData.orderState * 1 > 0">
  					<dt>借款人经营状况及财务状况</dt>
  					<dd>{{loanDetail.borrowerFinance}}</dd>
  				</dl>
  				<dl v-if="detailData.orderState * 1 > 0">
  					<dt>借款人还款能力变化情况</dt>
  					<dd>{{loanDetail.repaymentPower}}</dd>
  				</dl>
  				<dl v-if="detailData.orderState * 1 > 0">
  					<dt>借款人涉诉情况</dt>
  					<dd>{{loanDetail.borrowerComplaint}}</dd>
  				</dl>
  				<dl v-if="detailData.orderState * 1 > 0">
  					<dt>借款人受行政处罚情况</dt>
  					<dd>{{loanDetail.borrowerPunished}}</dd>
  				</dl>
  				<dl>
  					<dt>征信报告情况</dt>
  					<dd>平台已根据借款人客群特征，对其还款意愿及还款能力进行了综合评估，符合平台风控标准。借款人未提供央行征信报告。 <small>注：借款人未提供征信报告可能存在信用风险，请审慎做出决策。</small> </dd>
  				</dl>
  			</div>
  			<div class="item_dl" v-else>
  				<dl>
  					<dt>借款主体性质</dt>
  					<dd>企业法人</dd>
  				</dl>
  				<dl>
  					<dt>企业名称</dt>
  					<dd>{{loanDetail.borrowerName}}</dd>
  				</dl>
  				<dl>
  					<dt>统一社会信用代码</dt>
  					<dd>{{loanDetail.unifiedCode}}</dd>
  				</dl>
  				<dl>
  					<dt>注册资本</dt>
  					<dd>{{loanDetail.registeredCapital}}</dd>
  				</dl>
  				<dl>
  					<dt>注册地址</dt>
  					<dd>{{loanDetail.registeredAddress}}</dd>
  				</dl>
  				<dl>
  					<dt>成立时间</dt>
  					<dd>{{loanDetail.enterpriseDate}}</dd>
  				</dl>
  				<dl>
  					<dt>法定代表人</dt>
  					<dd>{{loanDetail.legalPerson}}</dd>
  				</dl>
  				<dl>
  					<dt>股东信息</dt>
  					<dd>{{loanDetail.shareholder}}</dd>
  				</dl>
  				<dl>
  					<dt>法人信用信息</dt>
  					<dd>{{loanDetail.legalPersonCredit}}</dd>
  				</dl>
  				<dl>
  					<dt>实缴资本</dt>
  					<dd>{{loanDetail.capital}}</dd>
  				</dl>
  				<dl>
  					<dt>办公地点</dt>
  					<dd>{{loanDetail.companyAdress}}</dd>
  				</dl>
  				<dl>
  					<dt>经营区域</dt>
  					<dd>{{loanDetail.area}}</dd>
  				</dl>
  				<dl>
  					<dt>手机号码</dt>
  					<dd>{{loanDetail.borrowerPhone}}</dd>
  				</dl>
  				<dl>
  					<dt>行业</dt>
  					<dd>{{loanDetail.borrowerPosition}}</dd>
  				</dl>
  				<dl>
  					<dt>收入</dt>
  					<dd>{{loanDetail.borrowerIncome}}</dd>
  				</dl>
  				<dl>
  					<dt>负债情况</dt>
  					<dd>{{loanDetail.currentDebt}}</dd>
  				</dl>
  				<dl>
  					<dt>历史借款情况</dt>
  					<dd>{{loanDetail.historyRepaymentDetail}}</dd>
  				</dl>
  				<dl>
  					<dt>平台借款金额</dt>
  					<dd>{{loanDetail.borrowerRepayingTotalAmount}}</dd>
  				</dl>
  				<dl>
  					<dt>限额管理</dt>
  					<dd>{{loanDetail.limitManagement}}</dd>
  				</dl>
  				<dl>
  					<dt>在本平台逾期次数</dt>
  					<dd>{{loanDetail.overdueTotalTimes}}</dd>
  				</dl>
  				<dl>
  					<dt>在本平台逾期金额</dt>
  					<dd>{{loanDetail.overdueTotalAmount}}</dd>
  				</dl>
  				<dl>
  					<dt>法人征信报告情况</dt>
  					<dd> 借款人已提供法人的征信报告，请复制以下链接至浏览器查看：{{loanDetail.creditReportUrl}} </dd>
  				</dl>
  			</div>
  		</div>
  	</div>
  </div>
</template>

<style src="assets/css/debtDetail.css">
</style>

<script>
import * as constants from './timeDepositRecordDebtDetailConstants';
export default {
  name: constants.NAME,
  data () {
    return {
      amount : '0.00',

      orderState : ['系统出借中','计息中','已结清'],
      repaymentTypeFont: ['', '先息后本', '一次性还本付息', '等额本息', '等本等息', '等额本息'],

      termUnit : ['','天','周','个月', '年'],
      //标的信息
      loanDetail : '',
      //债权还款计划
      creditRepaymentPlans : '',
      //出借(债权)信息
      detailData : '',
      investContract:'',

      curTabId : 1,

      nextLoanTransferId : '',
      orderId : '',
      loanId : '',
      creditId : '',
      bizStatus : '',
      investContract : '',
    }
  },
  components:{},//这里注册
  created:function () {
      this.orderId = this.$route.query.orderId;
      this.loanId = this.$route.query.loanId;
      this.creditId = this.$route.query.creditId;
      this.bizStatus = this.$route.query.bizStatus;
      this.investContract=this.$route.query.investContract;
      this.amount = this.$route.query.amount;
      this.nextLoanTransferId = this.$route.query.nextLoanTransferId;
      //债权还款详情
      this.getCreditDetail();
      //标的详情
      this.getLoanDetail();
      //债权还款列表
      this.getRepaymentList();
  },
  computed: {},
  methods: {
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
        this.curTabId = num;
    },
    //债权还款详情
    getCreditDetail() {
        var _this = this;

        $.ajax({
            url: _this.utils.AJAXDOMAINNAME+'/wap/order/sdqOrderDetail',
            data: '{"orderId":"' + _this.orderId + '"}',
            async : false,
            success: function(res) {
                if (res.code == 1) {
                    _this.detailData = res.data;
                }
            }
        })
    },
    //标的详情
    getLoanDetail() {
        var _this = this;
        $.ajax({
            url: _this.utils.AJAXDOMAINNAME+'/wap/order/loanDetail',
            data: '{"loanId":"' + _this.loanId + '"}',
            success: function(res) {
                if (res.code == 1) {
                    _this.loanDetail = res.data;
                }
            }
        })
    },
    //债权还款列表
    getRepaymentList() {
        var _this = this;
        $.ajax({
            url: _this.utils.AJAXDOMAINNAME + '/wap/order/sdqCreditRepaymentList',
            data: '{"creditId":"'+ _this.creditId +'", "nextLoanTransferId":"'+ _this.nextLoanTransferId +'"}',
            success: function(res) {
                if (res.code == 1) {
                    _this.creditRepaymentPlans = res.data;
                }
            }
        })
    }

  }
}

</script>
