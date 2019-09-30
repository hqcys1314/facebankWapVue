<template>
  <div class="directRecordDebtDetail" v-cloak>
    <ul class="switch_tab">
      <li v-on:click="listTab(1)" v-bind:class="{current : tabIndex_1}"
      class="sensors-btn" sensors-name="直投列表_债权详情_出借信息">出借信息</li>
      <li v-on:click="listTab(2)" v-bind:class="{current : tabIndex_2}"
      class="sensors-btn" sensors-name="直投列表_债权详情_还款计划">还款计划</li>
      <li v-on:click="listTab(3)" v-bind:class="{current : tabIndex_3}"
      class="sensors-btn" sensors-name="直投列表_债权详情_标的详情">标的详情</li>
    </ul>
    <div v-show="tabIndex_1">
        <div class="item_box">
    	  <div class="title">出借信息</div>
    	  <div class="item_dl">
    		<dl>
    		  <dt>出借时间</dt>
    		  <dd>{{detailData.investDate}}</dd>
    		</dl>
    		<dl>
    		  <dt>标的出借信息</dt>
    		  <dd>{{detailData.investAmount}}元</dd>
    		</dl>
    		<dl>
    		  <dt>标的状态</dt>
    		  <dd :class="stateClass">{{orderState[detailData.orderState]}}</dd>
    		</dl>
    		<dl>
    		  <dt>已还本金</dt>
    		  <dd>{{detailData.hasRepayPrincipal || '0.00'}}元</dd>
    		</dl>
    		<dl>
    		  <dt>已还利息</dt>
    		  <dd>{{detailData.hasRepayProfit || '0.00'}}元</dd>
    		</dl>
    		<dl>
    		  <dt>待还本金</dt>
    		  <dd>{{detailData.waitToCollectPrincipal || '0.00'}}元</dd>
    		</dl>
    		<dl>
    		  <dt>待还利息</dt>
    		  <dd>{{detailData.waitToCollectProfit || '0.00'}}元</dd>
    		</dl>
    		<dl v-if="detailData.loanTransferOrder == '1'">
    		  <dt>债权转让协议</dt>
    		  <dd><span><a :href="detailData.investContract">查看</a></span></dd>
    		</dl>
    		<dl v-else>
    		  <dt>借款协议</dt>
    		  <dd><span><a :href="detailData.investContract">查看</a></span></dd>
    		</dl>
    		<dl>
    		  <dt>资金使用情况</dt>
    		  <dd>已用于{{creditDetailData.borrowerUseName}}</dd>
    		</dl>
    	  </div>
    	</div>
    </div>
    <div v-show="tabIndex_2">
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
    		  <tr v-for="(item, index) in creditRepaymentPlans">
                  <td>{{item.repayBatch}}</td>
                  <td>{{item.repayPredictDate.replace('00:00:00', '')}}</td>
                  <td>{{item.repayPrincipal}}</td>
                  <td>{{item.repayInterest}}</td>
                  <td class="small2" v-if="item.repayState == '200'">已还款</td>
                  <td class="small2" v-if="item.repayState == '100'">未还款</td>
                  <td class="small2" v-if="item.repayState == '400'">提前还款</td>
                  <td>{{item.repayDate}}</td>
    		  </tr>
    		</tbody>
    		</table>
    	  </div>

    	  <div class="title title3" v-if="creditDetailData.assetType*1 == 50 || creditDetailData.assetType*1 == 70 || creditDetailData.assetType*1 == 80">
    		  Q 实际还款日是否会与理论还款日不一致
    	  </div>
    	  <div class="title title3" v-else>Q 如果理论还款日遇到节假日，怎么还款？</div>

    	  <div class="content content2">
    		  <div v-if="creditDetailData.assetType*1 == 60">
    			  A 不同助贷机构的债权在节假日的约定还款方式存在差异，请在购买后的债权详情中查询具体还款方式
    		  </div>
    		  <div v-else-if="creditDetailData.assetType*1 == 50 || creditDetailData.assetType*1 == 70 || creditDetailData.assetType*1 == 80">
    			  A 由于银行结算时间的原因，实际还款日为理论还款日当天或理论还款日的下一个工作日
    		  </div>
    		  <div v-else>
    			  A 不同助贷机构存在差异。本项目<span v-if="creditDetailData.channelName">（助贷机构：{{creditDetailData.channelName}}）</span>的约定还款日如下：
    		  </div>
    	  </div>

    	  <div class="content" v-if="creditDetailData.assetType*1 != 50 && creditDetailData.assetType*1 != 60 && creditDetailData.assetType*1 != 70 && creditDetailData.assetType*1 != 80">
    	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    		<thead>
    		  <tr>
    			<th class="w206">理论还款日</th>
    			<th>约定还款日</th>
    		  </tr>
    		</thead>
    		<tbody v-html="repaymentDesc[channelId]">
    		</tbody>
    	  </table>
    	  </div>
    	  <p class="q">Q 借款人会发生提前还款吗？</p>
    	  <p>A 借款人有能力一次性清偿债务的话，可以发起提前还款。提前还款金额 = 待收本金 + 当期利息</p>
    	  <div class="blank90"></div>
    	</div>

    </div>
    <div v-show="tabIndex_3">
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
    		  <dd>{{creditDetailData.amount}}元</dd>
    		</dl>
    		<dl>
    		  <dt>借款期限</dt>
    		  <dd>{{creditDetailData.termCount}}{{termUnit[creditDetailData.termUnit]}}</dd>
    		</dl>
        <dl>
          <dt>还款方式</dt>
          <dd v-if="creditDetailData.productType==1">{{productType[creditDetailData.productType]}}(利息=订单金额*标的年化利率*期限(月)/12)</dd>
          <dd v-if="creditDetailData.productType==2">{{productType[creditDetailData.productType]}}(到期总还款额=借款本金+借款本金*出借天数*年利率/365)</dd>
          <dd v-else="creditDetailData.productType==3">{{productType[creditDetailData.productType]}}<img style="width:100%;" src="https://static.facebank.cn/static/wapFront/invest/img/dengegongshi.png"></dd>
        </dl>
    		<dl>
    		  <dt>申请时间</dt>
    		  <dd>{{creditDetailData.applyDate}}</dd>
    		</dl>
        <dl>
          <dt>募集开始时间</dt>
          <dd>{{creditDetailData.raiseStartDate}}</dd>
        </dl>
        <dl>
          <dt>募集终止时间</dt>
          <dd>{{creditDetailData.raiseEndDate}}</dd>
        </dl>
        <dl v-if="creditDetailData.fullLoanDate!=null">
          <dt>满标时间</dt>
          <dd>{{creditDetailData.fullLoanDate}}</dd>
        </dl>
        <dl>
          <dt>起息日</dt>
          <dd>{{creditDetailData.startInterestDate }}</dd>
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
        <dl>
       <dt>项目风险评估结果</dt>
         <dd>{{creditDetailData.riskGradeName}}<span class="small">注：{{creditDetailData.riskResult }}</span></dd>
       </dl>
       <dl v-if="creditDetailData.riskType!=null&&creditDetailData.riskType!=''">
           <dt>经风险评估，该项目您的出借金额上限</dt>
           <dd>{{creditDetailData.amountLimit}}<span class="small">注：根据您的风险类型（{{creditDetailData.riskType}}），为您计算您可出借至此标的的最高限额。</span></dd>
       </dl>
       <dl>
            <dt>担保措施</dt>
            <dd>{{creditDetailData.guaranteeMethod || creditDetailData.repayProtectMeasure}}</dd>
        </dl>
    	  </div>
    	</div>
    	<div class="item_box">
    	  <div class="title">借款人信息</div>
        <!-- borrowerType 1 个人 , 2 企业 -->
        <div class="item_dl">
          <dl>
            <dt>借款主体性质</dt>
            <dd>自然人</dd>
          </dl>
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
              <dt>负债情况</dt>
              <dd>{{creditDetailData.currentDebt}}</dd>
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
            <dd>{{creditDetailData.limitManagement}}</dd>
          </dl>
          <dl>
            <dt>在本平台逾期次数</dt>
            <dd>{{creditDetailData.overdueTotalTimes}}</dd>
          </dl>
          <dl>
            <dt>在本平台逾期金额</dt>
            <dd>{{creditDetailData.overdueTotalAmount}}</dd>
          </dl>
          <dl v-if="detailData.orderState * 1 > 0">
            <dt>借款人经营状况及财务状况</dt>
            <dd>{{creditDetailData.borrowerFinance}}</dd>
          </dl>
          <dl v-if="detailData.orderState * 1 > 0">
            <dt>借款人还款能力变化情况</dt>
            <dd>{{creditDetailData.repaymentPower}}</dd>
          </dl>
          <dl v-if="detailData.orderState * 1 > 0">
            <dt>借款人涉诉情况</dt>
            <dd>{{creditDetailData.borrowerComplaint}}</dd>
          </dl>
          <dl v-if="detailData.orderState * 1 > 0">
            <dt>借款人受行政处罚情况</dt>
            <dd>{{creditDetailData.borrowerPunished}}</dd>
          </dl>
          <dl>
              <dt>征信报告情况</dt>
              <dd>平台已根据借款人客群特征，对其还款意愿及还款能力进行了综合评估，符合平台风控标准。借款人未提供央行征信报告。
                  <small>注：借款人未提供征信报告可能存在信用风险，请审慎做出决策。</small>
              </dd>
          </dl>
        </div>

    	</div>
    </div>

  </div>
</template>

<style scoped src="./directRecordDebtDetailOld.css">
</style>

<script>
import * as constants from './directRecordDebtDetailOldConstants';
import {utils,globalVariable} from'tools'

export default {
  name: constants.NAME,
  data () {
    return {
        tabIndex_1 : true,
  	  tabIndex_2 : false,
  	  tabIndex_3 : false,

  	  pageType : '${type}',

  	  stateClass : 'state_',
  	  orderState : ['系统出借中','计息中','已结清'],
  	  productType : ['','先息后本','一次性还本付息','等额本息','等本等息'],

  	  termUnit : ['','天','周','个月', '年'],

  	  getCreditDetailUrl : '/wap/getCreditDetailByCreditId',
  	  creditDetailData : '',

  	  getCreditRepaymentPlansUrl : '/wap/getCreditRepaymentPlans',
  	  creditRepaymentPlans : [],

  	  //当前出借信息
  	  getUserInvestSeparateOrderDetailUrl : '/wap/getUserInvestCreditDetail',
  	  //当前出借信息数据
  	  detailData : '',

  	  repayMentArr : [
  		  '闪银', '宇海恒通', '掌众', '藕丁', '魔法现金', '量化派白条', '嗨钱', '量化派现金分期', '普惠快捷', '百融-水象', '我来贷', '百融-乐普', '现金侠', '浅橙'
  	  ],
  	  channelId: '',
  	  repaymentDesc : [
  		  //闪银
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">顺延到双休后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">前4天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">前4天提前至放假前一个工作日还款，后4天顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //宇海恒通
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">提前到放假前第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">提前到放假前第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">提前到放假前第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">提前到放假前第一个工作日还款</td>\
  		  </tr>',
  		  //掌众
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">顺延到双休后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">前2天提前至放假前一个工作日还款，第3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">前4天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">前5天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //藕丁
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">提前到双休前第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">前2天提前至放假前一个工作日还款，第3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">前4天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">前5天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //魔法现金
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">顺延到双休后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">前2天提前至放假前一个工作日还款，第3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">前4天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">前5天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //量化派白条
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">收假后第一工作日</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">收假后第一工作日</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">收假后第一工作日</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">收假后第一工作日</td>\
  		  </tr>',
  		  //嗨钱
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">顺延到双休后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">提前到放假前第一个工作日还款</td>\
  		  </tr>\
  		  <tr style="display:none;">\
  			<td>7天节日</td>\
  			<td class="small">7天还款规则不明</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">前5天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //量化派现金分期
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">提前到双休前第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">前2天提前至放假前一个工作日还款，第3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr style="display:none;">\
  			<td>7天节日</td>\
  			<td class="small">7天还款规则不明</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">前5天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //普惠快捷
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">顺延到双休后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //百融-水象
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">顺延到双休后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">前2天提前至放假前一个工作日还款，第3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">前4天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">前5天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //我来贷
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">顺延到双休后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">前2天提前至放假前一个工作日还款，第3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">前3天提前至放假前一个工作日还款，后4天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">前4天提前至放假前一个工作日还款，后4天顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //百融-乐普
  		  '<tr>\
  			<td>双休</td>\
  			<td class="small">顺延到双休后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>3天节日</td>\
  			<td class="small">前2天提前至放假前一个工作日还款，第3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>7天节日</td>\
  			<td class="small">前4天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>\
  		  <tr>\
  			<td>8天节日</td>\
  			<td class="small">前5天提前至放假前一个工作日还款，后3天顺延到收假后第一个工作日还款</td>\
  		  </tr>',
  		  //现金侠
  		  //浅橙
  	  ]
    }
  },
  components:{},//这里注册
  created:function () {
      this.orderId = this.$route.query.orderId;
      this.loanId = this.$route.query.loanId;
      this.creditId = this.$route.query.creditId;
      this.bizStatus = this.$route.query.bizStatus;
      this.isOldSys = this.$route.query.isOldSys;
      this.investContract=this.$route.query.investContract;
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
    listTab (num) {
        if (num == 1) {
            this.tabIndex_1=true;
            this.tabIndex_2=false;
            this.tabIndex_3=false;
        } else if (num == 2) {
            this.tabIndex_1=false;
            this.tabIndex_2=true;
            this.tabIndex_3=false;
        } else{
            this.tabIndex_1=false;
            this.tabIndex_2=false;
            this.tabIndex_3=true;
        }
    },
    closeLayer (){

    },
    //债权还款详情
    getCreditDetail: function() {
        var _this = this;

        $.ajax({
            url : utils.AJAXDOMAINNAME+ '/wap/order/creditOldSysRepaymenDetail',
            data: '{"orderId":"' + _this.orderId + '","creditId":"' + _this.creditId + '"}',
            async : false,
            success: function(res) {
                if (res.code == 1) {
                    _this.detailData = res.data;
                }
            }
        })
    },
    //标的详情
    getLoanDetail: function() {
        var _this = this;
        $.ajax({
            url : utils.AJAXDOMAINNAME+ '/wap/getCreditDetailByCreditId',
            data: '{"creditId":"'+ _this.creditId +'","orderId":"'+ _this.orderId +'"}',
            success: function(res) {
                if (res.code == 1) {
                    _this.creditDetailData = res.data;
                    for (var i = 0; i < _this.repayMentArr.length; i++) {
                        if (new RegExp(_this.creditDetailData.channelName).test(_this.repayMentArr[i])) {
                            _this.channelId = i;
                            break;
                        }
                    }
                }
            }
        })
    },

    //债权还款列表
    getRepaymentList: function() {
        var _this = this;
        $.ajax({
            url : utils.AJAXDOMAINNAME+ '/wap/order/oldCreditRepaymentList',
            data: '{"creditId":"'+ _this.creditId +'"}',
            success: function(res) {
                if (res.code == 1) {
                    _this.creditRepaymentPlans = res.data.repaymentList;
                }
            }
        })
    }

  }
}

</script>
