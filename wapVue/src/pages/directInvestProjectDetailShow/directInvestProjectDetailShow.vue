<template>
  <div  id="directInvestProjectDetailShow" v-cloak>
    <div class="match-detail" >
			<div class="match-detail-title">标的信息</div>
			<div class="match-detail-content">
				<ul>
					<li><span class="span1">助贷机构</span><span class="span2">{{loanInfoBo.channelName}}</span></li>
					<li><span class="span1">标的编号</span><span class="span2">{{loanInfoBo.loanNum}}</span></li>
					<li><span class="span1">借款用途</span><span class="span2">{{loanInfoBo.borrowerUseName}}</span></li>
					<li><span class="span1">借款金额</span><span class="span2">{{loanInfoBo.amount}}元</span></li>
					<li><span class="span1">借款期限</span> <span class="span2"
						v-if="loanInfoBo.termUnit=='1'">{{loanInfoBo.termCount}}天</span> <span
						class="span2" v-if="loanInfoBo.termUnit=='2'">{{loanInfoBo.termCount}}周</span>
						<span class="span2" v-if="loanInfoBo.termUnit=='3'">{{loanInfoBo.termCount}}月</span>
						<span class="span2" v-if="loanInfoBo.termUnit=='4'">{{loanInfoBo.termCount}}年</span>
					</li>
					<li><span class="span1">还款方式</span>
                        <span class="span2" v-if="loanInfoBo.productType=='1'"> 先息后本 (利息=订单金额*标的年化利率*期限(月)/12)</span>
                        <span class="span2" v-if="loanInfoBo.productType=='2'"> 一次性还本付息(到期总还款额=借款本金+借款本金*出借天数*年利率/365) </span>
						<span class="span2" v-if="loanInfoBo.productType=='3'||loanInfoBo.productType=='5'">等额本息 <img style="width:100%;" src="https://static.facebank.cn/static/wapFront/invest/img/dengegongshi.png"></span>
						<span class="span2" v-if="loanInfoBo.productType=='4'">等本等息 </span>
					</li>
					<li><span class="span1">申请时间</span><span class="span2">{{loanInfoBo.applyDate}}</span></li>
          <li><span class="span1">募集开始时间</span><span class="span2">{{loanInfoBo.raiseStartDate}}</span></li>
          <li><span class="span1">募集终止时间</span><span class="span2">{{loanInfoBo.raiseEndDate}}</span></li>
          <li v-if="loanInfoBo.fullLoanDate!=null&&loanInfoBo.fullLoanDate!=''"><span class="span1">满标时间</span><span class="span2">{{loanInfoBo.fullLoanDate}}</span></li>
          <li><span class="span1">起息日</span><span class="span2">{{loanInfoBo.startInterestDate}}</span></li>

          <li><span class="span1">借款简介</span><span class="span2">借款人于{{formatDate(loanInfoBo.applyDate)}}借款用于{{loanInfoBo.borrowerUseName}}</span></li>

					<li><span class="span1">截止借款前6个月内借款人征信报告中的逾期情况</span><span class="span2">{{loanInfoBo.creditOverdueCount}}</span></li>
					<li><span class="span1">借款人在其他借款平台的借款情况</span><span class="span2">{{loanInfoBo.otherPlatformBorrowCount}}</span></li>
          <li style="display:none;"><span class="span1">底层借款利率</span><span class="span2">{{loanInfoBo.actualRate}}</span></li>
					<li><span class="span1">逾期罚息（利率）</span><span class="span2">{{loanInfoBo.overdueInterest}}</span></li>
					<li><span class="span1">各类服务费</span><span class="span2">{{loanInfoBo.otherFee}}</span></li>
					<li><span class="span1">还款来源</span><span class="span2">{{loanInfoBo.sourceOfRepayment}}</span></li>
          <li><span class="span1">项目风险评估结果</span><span class="span2">{{loanInfoBo.riskGradeName}}<span class="small">注：{{loanInfoBo.riskResult}}</span></span></li>
          <li v-if="loanInfoBo.riskType!=null&&loanInfoBo.riskType!=''"><span class="span1">经风险评估，该项目您的出借金额上限</span><span class="span2">{{loanInfoBo.amountLimit}}<span class="small">注：根据您的风险类型（{{loanInfoBo.riskType}}），为您计算您可出借至此标的的最高限额。</span></span></li>
          <li><span class="span1">担保措施</span><span class="span2">{{loanInfoBo.guaranteeMethod}}</span></li>
				</ul>
			</div>
		</div>
		<div class="match-detail">
			<div class="match-detail-title">借款人信息</div>
			<div class="match-detail-content">
				<ul v-if="loanInfoBo.borrowerType=='1'">
          <li><span class="span1">借款主体性质</span><span class="span2">自然人</span></li>
					<li><span class="span1">姓名</span><span class="span2">{{loanInfoBo.borrowerName}}</span></li>
					<li><span class="span1">身份证号码</span><span class="span2">{{loanInfoBo.borrowerIdcard}}</span></li>
					<li><span class="span1">手机号码</span><span class="span2">{{loanInfoBo.borrowerPhone}}</span></li>


					<li><span class="span1">行业</span><span class="span2">{{loanInfoBo.borrowerPosition}}</span></li>
					<li><span class="span1">年龄</span><span class="span2">{{loanInfoBo.borrowerAge}}</span></li>
					<li style="display:none"><span class="span1">居住城市</span><span class="span2">{{loanInfoBo.borrowerAddress}}</span></li>
					<li><span class="span1">收入</span><span class="span2">{{loanInfoBo.borrowerIncome}}</span></li>
          <li><span class="span1">负债情况</span><span class="span2">{{loanInfoBo.currentDebt}}</span></li>

					<li><span class="span1">历史借款情况</span><span class="span2">{{loanInfoBo.historyRepaymentDetail}}</span></li>



					<li><span class="span1">平台借款金额</span><span class="span2">{{loanInfoBo.borrowerRepayingTotalAmount}}</span></li>
					<li><span class="span1">限额管理</span><span class="span2">借款人该笔借款没有超过监管要求的借款余额上限。</span></li>
					<li><span class="span1">在本平台逾期次数</span><span class="span2">{{loanInfoBo.overdueTotalTimes}}</span></li>
					<li><span class="span1">在本平台逾期金额</span><span class="span2">{{loanInfoBo.overdueTotalAmount == 0 ? loanInfoBo.overdueTotalAmount : '0元'}}</span></li>
                    <li><span class="span1">征信报告情况</span><span class="span2">平台已根据借款人客群特征，对其还款意愿及还款能力进行了综合评估，符合平台风控标准。借款人未提供央行征信报告。<br><small style="display:block;color:#848999;">注：借款人未提供征信报告可能存在信用风险，请审慎做出决策。</small></span></li>
				</ul>
        <ul v-else>
          <li><span class="span1">借款主体性质</span><span class="span2">企业法人</span></li>
          <li><span class="span1">企业名称</span><span class="span2">{{loanInfoBo.borrowerName}}</span></li>
          <li><span class="span1">统一社会信用代码</span><span class="span2">{{loanInfoBo.unifiedCode}}</span></li>
          <li><span class="span1">注册资本</span><span class="span2">{{loanInfoBo.registeredCapital}}</span></li>
          <li><span class="span1">注册地址</span><span class="span2">{{loanInfoBo.registeredAddress}}</span></li>
          <li><span class="span1">成立时间</span><span class="span2">{{loanInfoBo.enterpriseDate}}</span></li>
          <li><span class="span1">法定代表人</span><span class="span2">{{loanInfoBo.legalPerson}}</span></li>
          <li><span class="span1">股东信息</span><span class="span2">{{loanInfoBo.shareholder}}</span></li>
          <li><span class="span1">法人信用信息</span><span class="span2">{{loanInfoBo.legalPersonCredit}}</span></li>
          <li><span class="span1">实缴资本</span><span class="span2">{{loanInfoBo.capital}}</span></li>
          <li><span class="span1">办公地点</span><span class="span2">{{loanInfoBo.companyAdress}}</span></li>
          <li><span class="span1">经营区域</span><span class="span2">{{loanInfoBo.area}}</span></li>

					<li><span class="span1">手机号码</span><span class="span2">{{loanInfoBo.borrowerPhone}}</span></li>
					<li><span class="span1">行业</span><span class="span2">{{loanInfoBo.borrowerPosition}}</span></li>
					<li><span class="span1">收入</span><span class="span2">{{loanInfoBo.borrowerIncome}}</span></li>
          <li><span class="span1">负债情况</span><span class="span2">{{loanInfoBo.currentDebt}}</span></li>

					<li><span class="span1">历史借款情况</span><span class="span2">{{loanInfoBo.historyRepaymentDetail}}</span></li>

					<li><span class="span1">平台借款金额</span><span class="span2">{{loanInfoBo.borrowerRepayingTotalAmount}}</span></li>
					<li><span class="span1">限额管理</span><span class="span2">{{loanInfoBo.limitManagement}}</span></li>
					<li><span class="span1">在本平台逾期次数</span><span class="span2">{{loanInfoBo.overdueTotalTimes}}</span></li>
					<li><span class="span1">在本平台逾期金额</span><span class="span2">{{loanInfoBo.overdueTotalAmount == 0 ? loanInfoBo.overdueTotalAmount : '0元'}}</span></li>
          <li><span class="span1">法人征信报告情况</span><span class="span2">借款人已提供法人的征信报告，请复制以下链接至浏览器查看：{{loanInfoBo.creditReportUrl}}</span></li>
				</ul>
			</div>
		</div>


  </div>
</template>
<style scoped src="./directInvestProjectDetailShow.css">
</style>
<script>
import {utils,globalVariable} from'tools'

export default {
    name:
    'directInvestProjectDetailShow',
    data() {
        return {
            loanInfoBo: '',
            loanId: '',
        }
    },
    created: function() {
        var _this = this;
        _this.loanId = _this.$route.query.loanId;
        $.ajax({
            url : utils.AJAXDOMAINNAME+ '/wap/order/loanDetail',
            data: '{"loanId":"' + _this.loanId + '"}',
            success: function(res) {
                if (res.code == 1) {
                    _this.loanInfoBo = res.data;
                }
            }
        })
    },
    methods: {
        formatDate: function(date) {
            if (date) {
                var dates = new Date(date.replace(/-/g, '/')),
                month = dates.getMonth() + 1,
                day = dates.getDate();
                month = month < 10 ? ('0' + month) : month;
                day = day < 10 ? ('0' + day) : day;
                return dates.getFullYear() + '年' + month + '月' + day + '日';
            }
        }
    }

}
</script>
