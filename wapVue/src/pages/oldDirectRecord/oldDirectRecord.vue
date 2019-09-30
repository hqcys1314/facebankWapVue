<template>
  <div id="directRecord" v-cloak>
          <ul class="switch_tab">
      			<li class=" sensors-btn" :class="{current : currentTab == 1}" v-on:click="listTab(1)" id="list1"
            sensors-name="wap出借记录页-回款中记录">回款中</li>
      			<li class=" sensors-btn" :class="{current : currentTab == 2}" v-on:click="listTab(2)" id="list2"
            sensors-name="wap出借记录页-投标中记录">投标中</li>
      			<li class="sensors-btn" :class="{current : currentTab == 3}" v-on:click="listTab(3)" id="list3"
            sensors-name="wap出借记录页-已完成记录">已完成</li>
      		</ul>
      <div class="listShow1">
      		<div class="invReList" style="background:none;">
                <empty text="暂无出借记录"></empty>
      		 </div>
      </div>
      <div class="listShow2" style="border:0;">

      		<div class="invReList" style="background:none;border:0;">
                <empty text="暂无出借记录"></empty>
      		</div>
      </div>
      <div class="listShow3" style="border:0">
            <div class="invReTitle" v-if="finalGoodList.length>0">
                <ul>
                  <li class="li1" style=padding-left:5%;>项目名称/时间</li>
                  <li class="li2" style=padding-right:5%;>净收益/出借金额(元)</li>
                </ul>
            </div>
            <div class="invReList" v-if="finalGoodList.length>0">
               <div  class="match-list" v-if="finalGoodList.length>0"
                    v-for="(finalGood,index) in finalGoodList">
                      <ul class="mx_detail"  v-on:click="lcdShow()">
                          <li class="li1">
                                 {{finalGood.title}}
                               <p>{{finalGood.investTime&&finalGood.investTime.substring(0, 10)}}</p>
                          </li>
                          <li class="li2">{{(finalGood.investAmount)}}
                               <p>{{finalGood.collectedInterest| toFixed}} <img src="~assets/wapFront/common/img/tip_i.png" class="ic_i"
                                 v-on:click="wancheng_icon(index)"></p>
                               <div class='mx_detail_img'><img :src='imgJt'></div>
                          </li>
                      </ul>
                      <section class='mx_detail_content' v-show="isShow">
                        <div class="mxd" v-for="lpsItem in finalGood.lps" v-if="finalGood.lps">
                          <div class="one">
                            <div class="div_num">{{lpsItem.phaseNumber}}</div>
                            <div class="div_content">
                              <div class="div_1">{{lpsItem.plannedTermPrincipal|currency}}</div>
                              <div class="div_2">本金（元）</div>
                            </div>
                            <div class="div_content">
                              <div class="div_1">{{lpsItem.plannedTermInterest|currency}}</div>
                              <div class="div_2">利息（元）</div>
                            </div>
                            <div class="div_content" style="border: 0;">
                              <div class="div_1">{{lpsItem.plannedTermAmount|currency}}</div>
                              <div class="div_2">总额（元）</div>
                            </div>
                          </div>
                          <div class="two">
                            <div class="div_date">还款日:{{lpsItem.dueDate&&lpsItem.dueDate.substring(0,10)}}</div>
                            <div class="div_date">实际还款日:{{lpsItem.repayDate&&lpsItem.repayDate.substring(0,10)}}</div>
                          </div>
                        </div>
                        <div class="mxd" v-else v-if="finalGood.isExp=='2'">
                          <div class="one">
                            <div class="div_num">1</div>
                            <div class="div_content">
                              <div class="div_1">{{finalGood.toBeCollectedPrincipal|currency}}</div>
                              <div class="div_2">本金（元）</div>
                            </div>
                            <div class="div_content">
                              <div class="div_1">{{finalGood.termReturnAmount|currency}}</div>
                              <div class="div_2">利息（元）</div>
                            </div>
                            <div class="div_content" style="border: 0;">
                              <div class="div_1">{{(finalGood.toBeCollectedPrincipal+finalGood.termReturnAmount)|currency}}</div>
                              <div class="div_2">总额（元）</div>
                            </div>
                          </div>
                          <div class="two">
                            <div class="div_date">还款日:首投后领取</div>
                            <div class="div_date" v-if="finalGood.isRetrieve==0">实际还款日:{{finalGood.nextRepayDate}}</div>
                            <div class="div_date" v-else>实际还款日:系统已回收</div>
                          </div>
                        </div>
                        <!-- <a class="xieyi" href="/seeProtocal">点此查看电子协议</a> -->
                      </section>

               </div>

               <div class="mainMore" v-if="showLoadMore">
                  <a href="javascript:;" v-on:click="nextPage()" >查看更多出借记录>></a>
               </div>
            </div>
            <empty v-else text="暂无出借记录"></empty>
      </div>
      <div class="wapMc" v-show="wapMcTk"></div>
      <div class="wapPos" v-show="expectedReturnShow">
          <div class="wapTip">
              <div class="div-value">
                  <p>借款利息({{expectedReturn.annualInterestRate}}%) <span class="span-right"><font>{{expectedReturn.basicInterest}}</font>元</span></p>
                  <p v-if="expectedReturn.marketingInterest*1>0&&expectedReturn.marketingType==1000">加息红包奖励(<a>{{expectedReturn.redPackageRate}}</a>%)<span class="span-right"><font>{{expectedReturn.marketingInterest}}</font>元</span></p>
                  <p v-else-if="expectedReturn.marketingInterest*1>0&&expectedReturn.marketingType==1010">返现红包奖励<span class="span-right"><font>{{expectedReturn.marketingInterest}}</font>元</span></p>
                  <p v-else-if="expectedReturn.marketingInterest*1>0">新手加息奖励<span class="span-right"><font>{{expectedReturn.marketingInterest}}</font>元</span></p>
                  <p v-if="expectedReturn.firstInterestAmount*1>0">首购加息奖励(<a>{{expectedReturn.firstInterestRate}}</a>%)<span class="span-right"><font>{{expectedReturn.firstInterestAmount}}</font>元</span></p>
                  <p v-if="expectedReturn.vipInterest*1>0">VIP会员加息奖励(<a>{{expectedReturn.vipRate}}</a>%)<span class="span-right"><font>{{expectedReturn.vipInterest}}</font>元</span></p>
                  </div>
              <p class="p3" v-on:click="closeTk()">
                  知道了
              </p>
          </div>
    </div>
  </div>
</template>
<style scoped src="./oldDirectRecord.css">
</style>
<script>
import {utils} from 'tools';

  export default {
    name: 'directRecord',
    data() {
      return {
        finalCurrPage: '1',
        finalGoodList:[],
        showLoadMore: false,
        wapMcTk: false,
        rpStatus: {
          nn: false
        },
        isShow:false,
        userId:'',
        currentTab : 1,
        imgJt:'/static/imgVar/rightJt.svg',
        expectedReturnShow:false,
        expectedReturn:[],
      };
    },
    components: {},//这里注册
    created: function () {
      this.userId=this.$route.query.micSecurityUserId;
      this.nextPage();
    },
    methods: {
      lcdShow:function(){
              if(this.isShow){
                  this.imgJt='/static/imgVar/downJt.svg';
                  this.isShow=false;
              }else{
                  this.imgJt='/static/imgVar/rightJt.svg';
                  this.isShow=true;
              }
          },
      listTab(num){
          for(var i=1;i<=3;i++){
              if(i==num){
                  $(".listShow"+i).show();
                  $("#list"+i).removeClass("invReTabOff").addClass("invReTabOn");
              }
              else{
                  $(".listShow"+i).hide();
                  $("#list"+i).removeClass("invReTabOn").addClass("invReTabOff");

              }
          }
          this.currentTab = num;
      },

      nextPage: function nextPage() {
        var _this = this;
        $.ajax({
        url : utils.AJAXDOMAINNAME+ '/wap/finalNextPage',
          data : '{"finalCurrPage":'+_this.finalCurrPage+'}',
          success : function(res){
                _this.finalCurrPage++;
                if(res.code==1){
                  if(res.data!=null){
                    res.data.voList.map(function(item){
                         _this.finalGoodList.push(item)
                     })
                     if(res.data.voList.length > 0 && res.data.voList.length == 10){
                       _this.showLoadMore = true;
                     }else if(res.data.voList.length < 10){
                       _this.showLoadMore = false;
                     }
                  }

                }
          }
        })

      },
      wancheng_icon:function(num){
          this.expectedReturn=this.finalGoodList[num*1];
          this.expectedReturnShow=true;
          this.wapMcTk=true;
      },

      closeTk: function () {
          this.wapMcTk = false;
          this.expectedReturnShow=false;
      }
    }
  };

</script>
