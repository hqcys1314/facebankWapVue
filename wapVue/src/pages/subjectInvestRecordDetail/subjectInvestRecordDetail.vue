<template>
  <div class="investRecordDetail">
      <ul class="switch_tab">
           <li v-on:click="listTab(1)" style="width:33.33%" v-bind:class="{current : tabIndex_1}"
           class="sensors-btn" sensors-name="新散标列表_散标详情_出借信息">出借信息</li>
           <li v-on:click="listTab(2)" style="width:33.33%" v-if="orderDetail.orderState*1 != 0" v-bind:class="{current : tabIndex_2}"
           class="sensors-btn" sensors-name="新散标列表_散标详情_还款计划">还款计划</li>
          <li v-on:click="listTab(3)" style="width:33.33%" v-bind:class="{current : tabIndex_3}"
           class="sensors-btn" sensors-name="新散标列表_散标详情_更多信息">更多信息</li>
      </ul>
      <div v-show="tabIndex_1">
          <!--出借动态-->
          <div class="item_box" v-if="orderDetail.newestReport&&orderDetail.orderState!='6'">
            <div class="title title2" style="display:none;" @click="toDynamic($route.query.orderId)"><span class="icon_right_arrow"></span>出借动态</div>
            <div class="item_dl style3" style="border-top:0;">
                <div class="item_title"><span>{{orderDetail.newestReport.businessTimeDesc}}</span>{{orderDetail.newestReport.subTitle}}</div>
                <orderDynamicDetail :rankData.sync="orderDetail.ranking" :items="orderDetail.newestReport"></orderDynamicDetail>
            </div>
          </div>
           <!--我的出借-->
           <div class="item_box">
             <div class="title">我的出借</div>
             <div class="item_dl">
               <dl>
                 <dt>出借日期</dt>
                 <dd><strong>{{orderDetail.createTime}}</strong></dd>
               </dl>
               <dl>
                 <dt>出借金额</dt>
                 <dd>
                     <strong>{{orderDetail.amount}}元</strong>
                 </dd>
               </dl>

               <dl v-if="orderDetail.orderState=='6'">
                 <dt>债转折让金额</dt>
                 <dd>
                   {{orderDetail.discountFee}}元
                   <small>*您折让{{orderDetail.discountFee}}元给受让人，实际还款本金不再包括该部分资金<br>
                     *债权转让折让金额=转让本金*折让率<br>
                     <router-link :to="{ path: '/claimsOutOrderStatus',query: {orderId : orderId,orderState:orderDetail.orderState}}">
                       查看债权转让详情
                     </router-link>
                   </small>
                 </dd>
               </dl>
               <dl>
                    <dt>借款合同约定年化利率</dt>
                    <dd><strong>{{orderDetail.rate}}</strong>
                        <small v-if="orderDetail.repaymentType == 1">*在先息后本的情况下，每月收回利息后立即再次出借，可获得更高回报</small>
                        <small v-if="orderDetail.repaymentType == 3||orderDetail.repaymentType == 5">*年化利率不代表实际回报。在等额本息情况下，若想获得更多利息，建议您每月收到回款后立即循环出借</small>
                    </dd>
              </dl>
               <dl v-if="orderDetail.orderState*1 == 2 || orderDetail.orderState*1 == 4|| orderDetail.orderState*1 == 6"><!--提前还款显示此项-->
                       <dt>已获回报</dt>
                       <dd>
                         <span :class="{'icon_warn' : (orderDetail.rewardList && orderDetail.rewardList.length > 0)}" v-if="orderDetail.orderState*1 == 2" @click="showShouyiLayer"><strong>{{orderDetail.hasRepayProfit}}元</strong></span>
                         <span class="icon_warn" v-if="orderDetail.orderState*1 == 4" @click="showEarlyRepaymentLayer"><strong>{{orderDetail.hasRepayProfit}}元</strong></span>
                         <small v-if="orderDetail.orderState=='6'||orderDetail.orderState=='5'">*因本订单已债权转让成功，未产生的利息将不再产生，未产生的加息奖励将作废</small>

                       </dd>
                     </dl>
               <dl v-else>
                 <dt>预期回报</dt>
                 <dd>
                     <span><strong>{{orderDetail.allInterest}}</strong>元</span>
                     <small v-if="orderDetail.orderState*1 == 1 && orderDetail.rewardList && orderDetail.rewardList.length > 0">应收利息 <i><strong>{{orderDetail.basicInterest}}元</strong></i></small>
                     <small v-if="orderDetail.orderState*1 == 1" v-for="rewardItem in mainReward">{{rewardItem.title}} <i><strong>{{rewardItem.rewardAmount}}元</strong></i></small>
                   <small v-if="orderDetail.orderState=='6'">*因本订单已债权转让成功，未产生的利息将不再产生，未产生的加息奖励将作废</small>
                   <small v-if="orderDetail.orderState=='5'"> *因您已对本订单发起债权转让，转让成功后未产生的利息将不再产生，未产生的加息奖励将作废
                   </small>

                 </dd>
               </dl>
               <dl v-if="isOldSys == 0 && (profitData != ''||(orderDetail.firstAddCash&&orderDetail.firstAddCash*1>0))">
                   <dt>额外返现奖励</dt>
                   <dd>
                       <span><strong>{{otherRewardTotal|currency}}</strong>元</span>
                       <small>*额外返现奖励将直接返现至笑脸账户余额</small>
                       <small v-for="item in otherReward">*{{item.title}}: {{item.rewardAmount}} {{item.status*1 == 1 || item.rewardType == '111' ? '已到账' : '订单结清时到账'}}</small>
                       <!-- <small v-if="profitData!=''">*返现卡返现：{{profitData.amount}}元（{{profitData.status*1 != 1 ? ('订单结清时到账') : '已到账'}} ）</small>
                       <small v-if="orderDetail.firstAddCash&&orderDetail.firstAddCash*1>0">*首购返现：{{orderDetail.firstAddCash}}元（已到账）</small> -->
                   </dd>
               </dl>
               <dl>
                 <dt>出借协议</dt>
                 <dd><span v-if="hasInterest"><a v-bind:href="orderDetail.investContract">查看</a></span><span v-else><a href="javascript:;">起息后生成</a></span></dd>
               </dl>
               <dl v-if="orderDetail.orderState*1 == 6">
                 <dt>债权转让协议</dt>
                 <dd><span><a :href="'https://cic.facebank.cn/wap/contract/orderTransfer?creditId='+creditId">查看</a></span></dd>
               </dl>
               <dl v-if="orderDetail.orderState && orderDetail.orderState*1 != 0">
                 <dt>资金使用情况</dt>
                 <dd>已用于{{creditDetailData.borrowerUseName}}</dd>
              </dl>

               <dl>
                 <dt></dt>
                 <dd></dd>
               </dl>
             </div>
           </div>
           <!--还款进度-->
           <div class="item_box" v-if="hasInterest">
             <div class="title">还款进度({{repaymentData.repayedPeriodCount || '0'}}/{{repaymentList.length}})</div>
             <div class="progress_box">
               <div class="progress_bar">
                 <div class="line"></div>
                 <div class="bar" v-bind:style="progressPP">
                   <div class="line"></div><div class="dian"></div>
                 </div>
                 <div class="text"><span>待还本息：<strong>{{orderDetail.waitToCollectPrincipalAndProfit || '0.00'}}元</strong></span>已还本息：<strong>{{orderDetail.hasRepayTotalAmount || '0.00'}}元</strong></div>
               </div>
             </div>
             <!--三种状态-->
             <!--正常-->
             <div class="claimIn" v-if="orderDetail.enableTransfer=='1'">*截至今日，预计最后一期出借资金撤出时间为{{orderDetail.repaymentRemainDays}}天后<router-link :to="{ path: '/claimsOutDetail',query: {orderId : orderId}}">债转退出</router-link>
             </div>
           </div>
           <!--我的出借-->
           <div class="item_box" style="display:none;">
             <div class="title">借款合同约定年化利率</div>
             <div class="item_dl style2">
               <dl>
                 <dt>项目名称</dt>
                 <dd>{{orderDetail.productName}}</dd>
               </dl>
               <dl>
                 <dt>项目状态</dt>
                 <dd v-bind:class="stateClass">{{orderState[orderDetail.orderState]}}</dd>
               </dl>
               <dl>
                 <dt>期限</dt>
                 <dd>{{isOldSys == 1 ? orderDetail.orderDeadLine : (orderDetail.termCount + ' ' + termUnit[orderDetail.termUnit])}}</dd>
               </dl>
               <dl>
                 <dt>还款方式</dt>
                 <dd>{{repaymentTypeFont[orderDetail.repaymentType]}}</dd>
               </dl>
               <dl v-if="orderDetail.borrowOrganization != ''">
                 <dt>助贷机构</dt>
                 <dd>{{orderDetail.borrowOrganization}}</dd>
               </dl>

             </div>

           </div>


          <!--已发起-->
          <div class="claimFq" v-if="orderDetail.orderState=='5'||orderDetail.orderState=='6'">在债权转让成功之前，待还本金、待还利息和待还奖励将按照还款计划还款至您的账户余额。
          </div>
          <router-link :to="{ path: '/claimsOutOrderStatus',query: {orderId : orderId,orderState:orderDetail.orderState}}" class="claimFqDetail" v-if="orderDetail.orderState=='5'">
                <span class="span2">转让中
                </span>
            <span class="span1">债权转让状态
                </span>
            <i class="iconfont icon-ic_rightarrow"></i>
          </router-link>
          <!--已完成-->
          <router-link :to="{ path: '/claimsOutOrderStatus',query: {orderId : orderId,orderState:orderDetail.orderState}}"  class="claimFqDetail"  v-if="orderDetail.orderState=='6'">
                <span class="span2">转让已完成
                </span>
            <span class="span1">债权转让状态
                </span>
            <i class="iconfont icon-ic_rightarrow"></i>

          </router-link>
           <services showItem="online, feedback" :rid="orderId" sourceType="bulk-standard-order"></services>
      </div>


      <div v-show="tabIndex_2" class="directRecordDebtDetail">
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
                       <tr v-for="item in repaymentList">
                       <td>{{item.repayBatch}}</td>
                       <td>{{item.repayPredictDate.replace('00:00:00', '')}}</td>
                       <td>{{item.repayPrincipal}}</td>
                       <td>{{item.repayInterest}}</td>
                       <td class="small3" v-if="item.repayState == '200'">已还款</td>
                       <td class="small3" v-if="item.repayState == '100'">未还款</td>
                       <td class="small3" v-if="item.repayState == '400'">提前还款</td>
                         <td class="small3" v-if="item.repayState == '300'">债权转让</td>
                         <td>{{item.repayDate || '&nbsp;'}}</td>
                       </tr>
                     </tbody>
                 </table>
             </div>

              <div class="title title3" v-if="orderDetail.assetType*1 == 50 || orderDetail.assetType*1 == 70 || orderDetail.assetType*1 == 80">
                 Q 实际还款日是否会与理论还款日不一致
               </div>
               <div class="title title3" v-else>Q 如果理论还款日遇到节假日，怎么还款？</div>

             <div class="content content2">
                 <div v-if="orderDetail.assetType*1 == 60">
                   A 不同助贷机构的债权在节假日的约定还款方式存在差异，请在购买后的债权详情中查询具体还款方式
                 </div>
                 <div v-else-if="orderDetail.assetType*1 == 50 || orderDetail.assetType*1 == 70 || orderDetail.assetType*1 == 80">
                   A 由于银行结算时间的原因，实际还款日为理论还款日当天或理论还款日的下一个工作日
                 </div>
                 <div v-else>
                   A 不同助贷机构存在差异。本项目<span v-if="creditDetailData.channelName">（助贷机构：{{creditDetailData.channelName}}）</span>的约定还款日如下：
                 </div>
          </div>
           <div class="content" v-if="orderDetail.assetType*1 != 50 && orderDetail.assetType*1 != 60 && orderDetail.assetType*1 != 70 && orderDetail.assetType*1 != 80">
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
                 <dd>{{orderDetail.termCount}}{{termUnit[orderDetail.termUnit]}}</dd>
               </dl>
               <dl>
                 <dt>还款方式</dt>
                 <dd v-if="orderDetail.repaymentType==1">{{repaymentTypeFont[orderDetail.repaymentType]}}(利息=订单金额*标的年化利率*期限(月)/12)</dd>
                 <dd v-else-if="orderDetail.repaymentType==2">{{repaymentTypeFont[orderDetail.repaymentType]}}(到期总还款额=借款本金+借款本金*出借天数*年利率/365)</dd>
                 <dd v-else="orderDetail.repaymentType==3||orderDetail.repaymentType==5">{{repaymentTypeFont[orderDetail.repaymentType]}}<img style="width:100%;" src="https://static.facebank.cn/static/wapFront/invest/img/dengegongshi.png"></dd>
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
               <dl v-if="creditDetailData.fullLoanDate!=null&&creditDetailData.fullLoanDate!=''">
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
                     <dd>{{creditDetailData.guaranteeMethod }}</dd>
                   </dl>
           </div>
         </div>
         <div class="item_box">
           <div class="title">借款人信息</div>
           <div class="item_dl"  v-if="creditDetailData.borrowerType==1">
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
                 <dd>{{(creditDetailData.borrowerIncome+'').indexOf('元') == -1 ? (creditDetailData.borrowerIncome + '元') : creditDetailData.borrowerIncome}}</dd>
               </dl>
               <dl>
                   <dt>负债</dt>
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
                   <dt>在本平台逾期次数</dt>
                   <dd>{{creditDetailData.overdueTotalTimes}}</dd>
                 </dl>
                 <dl>
                   <dt>在本平台逾期金额</dt>
                   <dd>{{creditDetailData.overdueTotalAmount ? creditDetailData.overdueTotalAmount : '0元'}}</dd>
                 </dl>

                 <dl v-if="orderDetail.orderState*1 == 1">
                     <dt>借款人经营状况及财务状况</dt>
                     <dd>{{creditDetailData.borrowerFinance}}</dd>
                   </dl>
                 <dl v-if="orderDetail.orderState*1 == 1">
                     <dt>借款人还款能力变化情况</dt>
                     <dd>{{creditDetailData.repaymentPower}}</dd>
                   </dl>
                 <dl v-if="orderDetail.orderState*1 == 1">
                     <dt>借款人涉诉情况</dt>
                     <dd>{{creditDetailData.borrowerComplaint}}</dd>
                   </dl>
                 <dl v-if="orderDetail.orderState*1 == 1">
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
           <div class="item_dl" v-else>
             <dl>
               <dt>借款主体性质</dt>
               <dd>企业法人</dd>
             </dl>
             <dl>
               <dt>企业名称</dt>
               <dd>{{creditDetailData.borrowerName}}</dd>
             </dl>
             <dl>
               <dt>统一社会信用代码</dt>
               <dd>{{creditDetailData.unifiedCode}}</dd>
             </dl>
             <dl>
               <dt>注册资本</dt>
               <dd>{{creditDetailData.registeredCapital}}</dd>
             </dl>
             <dl>
               <dt>注册地址</dt>
               <dd>{{creditDetailData.registeredAddress}}</dd>
             </dl>
             <dl>
               <dt>成立时间</dt>
               <dd>{{creditDetailData.enterpriseDate}}</dd>
             </dl>
             <dl>
               <dt>法定代表人</dt>
               <dd>{{creditDetailData.legalPerson}}</dd>
             </dl>
             <dl>
               <dt>股东信息</dt>
               <dd>{{creditDetailData.shareholder}}</dd>
             </dl>
             <dl>
               <dt>法人信用信息</dt>
               <dd>{{creditDetailData.legalPersonCredit}}</dd>
             </dl>
             <dl>
               <dt>实缴资本</dt>
               <dd>{{creditDetailData.capital}}</dd>
             </dl>
             <dl>
               <dt>办公地点</dt>
               <dd>{{creditDetailData.companyAdress}}</dd>
             </dl>
             <dl>
               <dt>经营区域</dt>
               <dd>{{creditDetailData.area}}</dd>
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
             <dl>
               <dt>法人征信报告情况</dt>
               <dd>借款人已提供法人的征信报告，请复制以下链接至浏览器查看：{{creditDetailData.creditReportUrl}}
               </dd>
             </dl>
           </div>
         </div>
    </div>
     <div class="wapMc" v-show="wapMcStatus" style="display:block">
     </div>
     <div class="layer_style" v-show="shouyiStatus" v-cloak>
         <div class="layer_content" style="text-align:left;line-height:1.5rem;padding:.5rem 1rem;margin:0">
             <div class="layer_profit_list">
                 <dl v-for="t in mainReward">
                     <dt><p>{{t.title}}</p><span>{{t.content}}</span></dt>
                     <dd>{{utils.currency(t.rewardAmount)}}<span>元</span></dd>
                 </dl>
             </div>
         </div>
         <div class="layer_btn one">
             <a href="javascript:;" @click="hideShouyiLayer()">知道了</a>
         </div>
     </div>
     <div class="wapPos"  style="display:block" v-show="showEarlyRepaymentState">
          <div class="wapTip">
              <div class="div-value"><p>由于提前还款，所有回报已发放至账户。</p></div>
              <p class="p3" v-on:click="closeLayer()">
                  知道了
              </p>
          </div>
       </div>
  </div>
</template>

<style src="assets/wapFront/common/css/investRecordDetail.css"></style>
<style src="./subjectInvestRecordDetail.css"></style>
<style>
  .claimIn{
    color: #848999;line-height: 1.25rem;padding: 0.5rem 0; font-size: 0.75rem;
    border-top: 1px #dfe3eb solid;
  }
  .claimIn a{margin-left: 0.5rem;color: #F0484E;font-size: 0.75rem}
  .claimFq{color: #848999;line-height: 1.25rem;padding: 0.5rem 1rem; font-size: 0.75rem;background: #FEF5E8;
    border-top: 1px #dfe3eb solid;color: #F48A12;margin-top: -0.46875rem;margin-bottom: 0.625rem;
  }
  .claimFqDetail{overflow: hidden;display:block;position: relative;border-bottom: 1px #dfe3eb solid;background-color: #ffffff;padding-left: 1rem;}
  .claimFqDetail:last-child{border-bottom: 0;}
  .claimFqDetail .span1 {
    color: #2B313D;
    font-size: 1rem;
    line-height: 3.25rem;
    margin-right: 0.5rem;

  }
  .claimFqDetail .span2 {
    float: right;  line-height: 3.25rem;  margin-right: 2rem;color: #848999;font-size: 1rem;
  }
  .claimFqDetail i{font-style:normal;font-weight:normal;color: #CED2D8;position: absolute;right: 0.6rem;top: 1.1rem;}
</style>
<script>
import * as constants from './subjectInvestRecordDetailConstants';
import {utils} from 'tools';
import orderDynamicDetail from '@/components/orderDynamicDetail';
export default {
    name:    constants.NAME,
    data() {
        return {
            tabIndex_1: true,
            tabIndex_2: false,
            tabIndex_3: false,

            orderId: '',
            creditId: '',
            loanId: '',
            //我的出借信息
            orderDetail: '',
            isOldSys : 0,

            //还款计划
            repaymentList: [],
            repaymentData : {},

            //标的详情
            creditDetailData: '',

            shouyiStatus: false,
            showEarlyRepaymentState: false,
            wapMcStatus: false,

            //是否已起息
            hasInterest: false,
            stateClass: 'state_',
            orderState: ['系统出借中', '计息中', '已结清', '流标', '提前还款','债权转让中','债权转让已完成'],

            termUnit: ['', '天', '周', '月', '年'],

            repaymentTypeFont : ['','先息后本','一次性还本付息','等额本息','等本等息','等额本息'],//固定账单日要求展示位等额本息
            //还款进度
            progressPP: '0%',

            //说明
            repayMentArr: ['闪银', '宇海恒通', '掌众', '藕丁', '魔法现金', '量化派白条', '嗨钱', '量化派现金分期', '普惠快捷', '百融-水象', '我来贷', '百融-乐普', '现金侠', '浅橙'],
            channelId: '',
            //闪银
            repaymentDesc: [

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
            profitData : '',
            otherReward : [],
            otherRewardTotal : 0,
            mainReward : [],
        }
    },
    created: function() {
        var _this = this;
        this.isOldSys = this.$route.query.isOldSys; //0：新系统，1：老系统
        this.orderId = this.$route.query.orderId;
        this.getOrderDetail();
        if(this.isOldSys*1 == 0){
            this.getOrderProfit();
        }

        //this.getCreditDetail();
        //this.getRepaymentList();
    },
    mounted(){

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
        },
        //tab键切换
        listTab: function(num) {
            if (num == 1) {
                this.tabIndex_1 = true;
                this.tabIndex_2 = false;
                this.tabIndex_3 = false;
            } else if (num == 2) {
                this.tabIndex_1 = false;
                this.tabIndex_2 = true;
                this.tabIndex_3 = false;
            } else {
                this.tabIndex_1 = false;
                this.tabIndex_2 = false;
                this.tabIndex_3 = true;
            }
        },
        closeLayer: function() {
            this.shouyiStatus = false;
            this.showEarlyRepaymentState = false;
            this.wapMcStatus = false;
        },
        showShouyiLayer: function() {
            if(this.orderDetail.rewardList && this.orderDetail.rewardList.length > 0){
                this.shouyiStatus = true;
                this.wapMcStatus = true;
            }
        },
        hideShouyiLayer: function() {
            this.shouyiStatus = false;
            this.wapMcStatus = false;
        },
        showEarlyRepaymentLayer: function() {
            this.showEarlyRepaymentState = true;
            this.wapMcStatus = true;
        },
        getOrderDetail: function() {
            var _this = this;

            $.ajax({
                url: utils.AJAXDOMAINNAME+(_this.isOldSys*1 == 1 ? '/wap/order/oldOrderDetail' : '/wap/order/retailLoanOrderDetail'),
                data: '{"orderId":"' + _this.orderId + '"}',
                async : false,
                success: function(res) {
                    if (res.code == 1) {
                        _this.orderDetail = res.data;
                        var orderDetail = _this.orderDetail;
                        _this.creditId = orderDetail.creditId;
                        _this.loanId = orderDetail.loanId;
                        _this.hasInterest = orderDetail.orderState != '0';
                        _this.stateClass = 'state_' + orderDetail.orderState;
                        var pp = parseFloat(orderDetail.hasRepayTotalAmount || 0, 10),
                            wantPp = parseFloat(orderDetail.waitToCollectPrincipalAndProfit || 0, 10);

                        _this.progressPP = 'width:' + (pp + wantPp > 0 ? parseInt((pp / (pp + wantPp)).toFixed(2) * 100) : 0) + '%';
                        if (orderDetail.orderState && orderDetail.orderState * 1 > 0) {
                            _this.getRepaymentList();
                        }

                        var rewardList = res.data.rewardList;
                        if(rewardList && rewardList.length > 0){
                            _this.otherReward = rewardList.filter(function(item){
                                return item.rewardType*1 == 111 || item.rewardType*1 == 112;
                            })
                            for(var i=0; i<_this.otherReward.length; i++){
                                _this.otherRewardTotal = _this.otherRewardTotal + _this.otherReward[i].rewardAmount*1
                            }
                            _this.mainReward = rewardList.filter(function(item){
                                return item.rewardType*1 != 111 && item.rewardType*1 != 112;
                            })
                        }

                        _this.getCreditDetail()
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
        toDynamic : function(orderId){


            this.$router.push({
                path : '/orderDynamic',
                query : {
                    orderId : orderId
                }
            })
        },
        getOrderProfit: function() {
            var _this = this;

            $.ajax({
                url: utils.AJAXDOMAINNAME+'/wap/getOrderCashBack ',
                data: '{"orderId":"' + _this.orderId + '"}',
                async : false,
                success: function(res) {
                    if (res.code == 1) {
                        _this.profitData = res.data ? res.data : '';
                    }
                }
            })
        },
        getCreditDetail: function() {
            var _this = this;
            var apiUrl = utils.AJAXDOMAINNAME+(_this.isOldSys*1 == 1 ? '/wap/getLoanDetailByOrderId' : '/wap/order/loanDetail'),
                apiData = _this.isOldSys*1 == 1 ? '{"orderId":"'+ _this.orderId +'"}' : '{"loanId":"' + _this.loanId + '"}';
            $.ajax({
                url: apiUrl,
                data: apiData,
                success: function(res) {
                    if (res.code == 1) {
                        _this.creditDetailData = res.data
                    }
                }
            })
        },

        //还款计划
        getRepaymentList: function() {
            var _this = this;
            $.ajax({
                url: utils.AJAXDOMAINNAME+(_this.isOldSys*1 == 1 ? '/wap/order/oldCreditRepaymentList' : '/wap/order/creditRepaymentList'),
                data: '{"creditId":"'+ _this.creditId +'"}',
                success: function(res) {
                    if (res.code == 1) {
                        _this.repaymentData = res.data;
                        _this.repaymentList.push.apply(_this.repaymentList, res.data.repaymentList)
                    }
                }
            })
        }
    },
    components: {orderDynamicDetail}
}
</script>
