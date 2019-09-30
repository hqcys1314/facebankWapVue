<template>
    <div class="directRecordRepayment" >
      <div class="item_box">
  		<div class="title">
  			<i></i>
  			<p>以本项目为例：</p>
  		</div>
  		<div class="content">
  			<p class="p1" v-if="resuleData.assetType=='60'">
                <span v-if="resuleData.repaymentType == 1">先息后本</span>
                <span v-if="resuleData.repaymentType == 3||resuleData.repaymentType==5">等额本息</span>
                  <span v-else="resuleData.repaymentType == 4">等本等息</span>
                  还款，期限
              <span v-if="resuleData.termUnit == 1 && resuleData.assetType != 60">{{resuleData.termCount}}天</span>
              <span v-if="resuleData.termUnit == 3">{{resuleData.termCount}}个月</span>
              <span v-if="resuleData.termUnit == 1 && resuleData.assetType == 60">{{tenThousandsInterestData.repaymentList.length}}个月</span>
              ，借款合同约定年化利率{{resuleData.rate}}%（不包括其他额外奖励），假设出借1万元本金且今日满标放款开始计息，则还款计划如下：</p>

              <p class="p1" v-else>期限
              <span v-if="resuleData.termUnit == 1 && resuleData.assetType != 60">{{resuleData.termCount}}天</span>
              <span v-if="resuleData.termUnit == 3">{{resuleData.termCount}}个月</span>
              <span v-if="resuleData.termUnit == 1 && resuleData.assetType == 60">{{tenThousandsInterestData.repaymentList.length}}个月</span>
              ，借款合同约定年化利率{{resuleData.rate}}%（不算其他额外奖励），假设出借1万元且今日满标放款开始计息，则还款计划如下：</p>

  		  <table width="100%" border="0" cellspacing="0" cellpadding="0">
  			<thead>
  			  <tr>
  				<th>期数</th>
  				<th>理论还款日</th>
  				<th>应收本金</th>
  				<th>应收利息</th>
  			</tr>
  			</thead>
  			<tbody>
  			  <tr v-for="item in tenThousandsInterestData.repaymentList">
  				<td>{{item.repayBatch}}</td>
  				<td>{{item.repayDate}}</td>
  				<td>{{item.repayPrincipal}}</td>
  				<td>{{item.repayInterest}}</td>
  			</tr>
  			</tbody>
  		  </table>
  			<p class="p2" v-if="resuleData.assetType=='60'">出借1万元本金利息合计约为：{{resuleData.tenThousandsInterest || 0.00}}元</p>
  			<p class="p2" v-else>出借1万元利息合计为：{{resuleData.tenThousandsInterest || 0.00}}元</p>

        <p class="p3" v-if="resuleData.repaymentType == 1"><span>*该利息不包括会员加息、红包加息等<br>*在先息后本的情况下，每月收回利息后立即再次出借，可获得更高回报 。</span><br>在先息后本情况下，每月还款金额将进入您的账户余额。若想获得更多利息，建议您每月收到回款后立即循环出借</p>
        <p class="p3" v-if="resuleData.repaymentType == 3"><span>*该利息不包括会员加息、红包加息等<br>*年化利率不代表实际回报。</span><br>在等额本息情况下，每月还款金额将进入您的账户余额。若想获得更多利息，建议您每月收到回款后立即循环出借</p>
        <p class="p3" v-if="resuleData.repaymentType==5"><span>*该利息不包括会员加息、红包加息等<br>*年化利率不代表实际回报。</span><br>在等额本息情况下，每月还款金额将进入您的账户余额。若想获得更多利息，建议您每月收到回款后立即循环出借<br>此标的的首次还款日已经确定，最终还款计划和回报总金额由标的实际起息日决定</p>

        <p class="p3" v-else-if="resuleData.repaymentType == 4"><span>*该利息不包括会员加息、红包加息等<br>*年化利率不代表实际回报。</span><br>在等本等息情况下，本金和利息会每月收回，建议您每月收到回款后立即循环出借，以获取更高回报</p>
  			<p class="p3" v-else-if="resuleData.repaymentType == 2">期限到期后，一次性收回所有的本金和利息</p>
  		</div>
  	</div>
  	<div class="item_box">
          <div class="title" v-if="resuleData.assetType*1 == 50 || resuleData.assetType*1 == 70 || resuleData.assetType*1 == 80">
  			<i></i>
  			<p>实际还款日是否会与理论还款日不一致</p>
  		</div>
  		<div class="title" v-else>
  			<i></i>
  			<p>如果理论还款日遇到节假日，怎么还款？</p>
  		</div>

  		<div class="content">
              <div v-if="resuleData.assetType*1 == 60">
                  <p class="p1">不同助贷机构的债权在节假日的约定还款方式存在差异，请在购买后的债权详情中查询具体还款方式</p>
              </div>
              <div v-else-if="resuleData.assetType*1 == 50 || resuleData.assetType*1 == 70 || resuleData.assetType*1 == 80">
                  <p class="p1">由于银行结算时间的原因，实际还款日为理论还款日当天或理论还款日的下一个工作日</p>
              </div>
              <div v-else>
      			<p class="p1">不同助贷机构存在差异。本项目（助贷机构：{{tenThousandsInterestData.channelName}}）的约定还款日如下：</p>
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
  			<p class="p2">借款人会提前还款吗？</p>
  			<p class="p3">借款人有能力一次性清偿债务的话，可以发起提前还款。提前还款金额 = 待收本金 + 当期应收利息</p>
  		</div>
  	</div>
</div>
</template>

<style scoped src="./directRecordRepayment.css"></style>

<script>
  import * as constants from './directInvestDetailRepaymentConstants';
  import {utils,globalVariable} from'tools'

  export default {
    name: constants.NAME,
    data() {
      return {
        directInvestDetailJsonUrl:'/wap/product/productDetail',
        resuleData:'',

        tenThousandsInterestUrl : '/wap/directProduct/tenThousandsInterest',
        tenThousandsInterestData : '',

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
        ],
        firstRepaymentDate:'',
      }
    },
    created:function () {
          this.productId = this.$route.query.productId;
          if(this.$route.query.firstRepaymentDate&&this.$route.query.firstRepaymentDate!=null){
            this.firstRepaymentDate = this.$route.query.firstRepaymentDate;
          }
           var _this = this;
            $.ajax({
       			url : utils.AJAXDOMAINNAME+ '/wap/product/productDetail',
       			data : '{"productId":"'+ this.productId+'"}',
       			success : function(res){
       				if(res.code==1){
                          _this.resuleData=res.data;
                          for(var i=0;i<_this.repayMentArr.length; i++){
                              if(new RegExp(_this.resuleData.channelName).test(_this.repayMentArr[i])){
                                  _this.channelId = i;
                                  break;
                              }
                          }
                          _this.progressBar=(res.data.amount-res.data.remainAmount)/(res.data.amount)*100;
       				}
       			}
          });

              $.ajax({
                 url : utils.AJAXDOMAINNAME+ '/wap/product/repaymentList',
                 data: `{"productId": "${this.productId}","firstRepaymentDate": "${this.firstRepaymentDate}"}`,
                 success : function(res){
                     if(res.code==1){
                         _this.tenThousandsInterestData=res.data;
                     }
                 }
             })
    },
    methods: {

    },
    components: {}
  }

</script>
