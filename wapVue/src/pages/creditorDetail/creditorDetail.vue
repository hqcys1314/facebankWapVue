<template>
  <div class="creditorDetail" v-cloak>
      <div class="creditorTop">
          <div class="title">转让债权-{{parameData.translateId}}</div>
          <div class="box">
              <div class="info">
                  <p class="lv"><span class="lv_num">{{parameData.creditRate}}</span><span class="unit">%</span><span class="desc"> 转让年化利率</span></p>
                  <p>剩余期限 <span>{{parameData.lastDays}}</span>天　　　转让金额 <span>{{parameData.translateAmount}}</span>元</p>
              </div>
              <div class="state">已转让</div>
          </div>
          <div class="progress_box">
            <div class="progress_bar">
              <div class="line"></div>
              <div class="bar" style="width:100%;">
                <div class="line"></div><div class="dian"></div>
              </div>
            </div>
            <div class="text">
                已售：<span>100%</span>
                <div class="right">剩余可投金额(元) <em>{{parameData.lastAmount}}</em></div>
            </div>
          </div>
      </div>

      <div class="items" >
          <a @click="showLayer()" ><span class="bicon_warn">{{repaymentTypeFont[parameData.repaymentType] || '无'}}</span>还款方式</a>
         <a href="javascript:;">
            <span style="padding-right: 0.5rem;background-position-x: 120%;">已结束 </span>募集期
         </a>
      </div>
     <div class="items">
       <a v-bind:href="'/creditorTransferDetail?transferUserId='+parameData.transferUserId+'&fpOrderId='+parameData.fpOrderId+'&creditId='+parameData.creditId+'&transferDate='+parameData.transferDate+'&translateAmount='+parameData.translateAmount">
          <span>&nbsp;</span>转让债权详情
       </a>
       <a v-bind:href="'/creditorBuyRecord?translateId='+parameData.translateId" >
            <span>&nbsp;{{parameData.buyTimes}}</span>购买记录
        </a>
     </div>

     <detailItemTips></detailItemTips>
     <div class="warn_tips"><span>本产品由深圳光华普惠科技有限公司提供</span><br>市场有风险，出借需谨慎</div>
     <div class="layerMask" v-show="showLayerStatus"  v-cloak >
        <div class="layer_style">
            <div v-if="parameData.repaymentType == 1">
                <div class="layer_title">什么是一次性还本付息?</div>
                <div class="layer_content" style="text-align:left;">定义：期限到期后，一次性收回所有的本金和利息。<br>
                 公式：<br>
                 • 期限按天计算：利息 = 本金 * 年利率 / {{utils.DAYSET}} * 期限（天）<br>
                 • 期限按月计算：利息 = 本金 * 年利率 / 12 * 期限（月）<br>
                 收回总金额 = 本金 + 利息<br>
                 比如：出借1万元到期限8个月、年化利率6%、一次性还本付息的项目，则8个月后收回的总金额为：<br>
                 10000 +10000 * 6% ÷12 * 8 = 10400元
                </div>
            </div>
            <div v-if="parameData.repaymentType == 4">
                <div class="layer_title">什么是先息后本?</div>
                <div class="layer_content" style="text-align:left;">定义：是指借款人在借款期内按月归还利息，在借款到期日一次性归还借款本金（按月付息，到 期还本付息）。<br>
                 公式：<br>
                 • 每月收回利息=出借金额*标的年化利率/12<br>
                 比如：出借 1 万元到期限 6 个月、年化利率 6%、先息后本的项目，则在 6 个月内每月收回的利息为： 10000*6%/12=50 元<br>
                 最后一月收回 10000 元出借本金<br>
                 在整个出借期内，实际可得利息总和为：50*6=300 元<br>
                 温馨提示：在先息后本的情况下，每月收回利息后立即再次出借，可获得更高回报
                </div>
            </div>
            <div v-if="parameData.repaymentType == 5">
                <div class="layer_title">什么是等本等息?</div>
                <div class="layer_content" style="text-align:left;">定义：在还款期内，出借人每月收回同等数额的还款(包括本金和利息)，且每月收回的本金和利息分别相等。<br>
                公式：<br>每月收回金额=本金/期数+本金x年化利率/12 <br>
                比如：出借1万元到期限8个月、年化利率6%、等本等息的项目，则在8个月内每月收回的金额为：<br>
                10000/8+10000*6%/12=1300元<br>
                <span>温馨提示：</span><br>
                在等本等息情况下，本金和利息会每月收回，建议您每月收到回款后立即循环出借，以获取更高回报
                </div>
            </div>
            <div v-if="parameData.repaymentType == 2">
                <div class="layer_title">什么是等额本息?</div>
                <div class="layer_content" style="text-align:left;">定义：在还款期内，出借人每月收回同等数额的还款(包括本金和利息)。<br>
                公式：<br>
                <img src="//static.facebank.cn/static/wapFront/sanbiao/img/gongshi-@2x.png" width="100%">
                <br>比如：出借1万元到期限8个月、年化利率6%、等额本息的项目，则在8个月内每月收回的金额为：<br>
                10000*（6%/12）*（1+6%/12）^8/((1+6%/12)^8-1)= 1278.29元<br>
                <span>温馨提示：年化利率不代表实际回报。</span><br>
                在等额本息情况下，若想获得更多利息，建议您每月收到回款后立即循环出借。
                </div>
            </div>
            <div class="layer_btn one">
                <a href="javascript:;" @click="()=>{this.showLayerStatus = false;}">知道了</a>
            </div>
        </div>
     </div>
     <loading :show.sync="showLoading"></loading>
  </div>
</template>

<style scoped src="./creditorDetail.css">
</style>

<script>
import * as constants from './creditorDetailConstants';
import layerRepaymentExplain from '@/components/layerRepaymentExplain'
import loading from '@/components/loading'
import detailItemTips from '@/components/detailItemTips'
import {utils} from 'tools';
  export default {
    name: constants.NAME,
    components:{layerRepaymentExplain, loading, detailItemTips},//这里注册
    data() {
      return {
          repaymentTypeFont : ['','一次性还本付息','等额本息','等额本金','先息后本','等本等息'],
          showLayerStatus : false,
          showLoading : false,
          parameData : {}
      }
    },
    created () {
        this.parameData = utils.getParames();
    },
    methods: {
        showLayer(){
            this.showLayerStatus = true;
        }
    }
  }
</script>
