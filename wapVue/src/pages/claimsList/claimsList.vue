<template>
  <div id="claimsList" v-cloak>
    <div class="title">
        <div class="list-con-record">
            <div class="number">
               借款人/转让人
            </div>
            <div class="date">
                交易时间
            </div>
            <div class="value">
                金额(元)
            </div>

        </div>
    </div>
    <div class="record" v-if="goodsList.length>0">
        <div class="list-con">
            <ul>
                <li v-for="item in goodsList" v-on:click="lcdShow(item.creditId)">
                    <div class="list-con-record" >
                        <div class="number">{{item.remark.split("###")[0]}}</div>
                        <div class="date">{{format(item.createTime)}}</div>
                        <div class="value">￥{{item.amount|currency}}</div>
                        <div class="arrow" v-if="item.creditId==isShow"><img src="/static/imgVar/downJt.svg"></div>
                        <div class="arrow" v-else><img src="/static/imgVar/rightJt.svg"></div>
                    </div>
                    <div class="list-con-detail" v-show="item.creditId==isShow">
                        <a class="span-left"
                           v-if="item.remark.split('###')[1] != '' && item.remark.split('###')[1] != null"
                           v-bind:href="item.remark.split('###')[1]">
                            购买协议</a>
                        <a class="span-left border-left-line1"
                           v-if="item.remark.split('###')[2] != '' && item.remark.split('###')[2] != null"
                           v-bind:href="item.remark.split('###')[2]">
                            转让协议</a>
                        <!-- <div v-if="item.remark.split('###')[3]=='finlink'">
                            <router-link :to="{ path: '/insuranceBill', query: {policyNo:item.policyNo,imageList:item.facebankImgAddress} }"
                                 v-if="item.facebankImgAddress != null && item.facebankImgAddress != ''"  class='span-left border-left-line1'>
                                    保险单
                            </router-link>
                            <a class="span-left border-left-line1" v-else  onclick="tusi()">保险单</a>
                        </div> -->
                    </div>
                </li>
            </ul>
        </div>
        <div class="more" v-on:click="cliamsNextPage()" v-if="goodsList.length>=20">点击加载更多 >></div>
    </div>
    <div class="record" v-else>
        <div class="change"><p class="p1"><img src="//static.facebank.cn/static/wapFront/myAccount/img/ic_match@2x.png"></p><p class="p2">正在努力撮合中</p></div>
    </div>
  </div>
</template>
<style scoped src="./claimsList.css">
</style>
<script>
import {utils,globalVariable} from'tools'

    export default {
      name: 'claimsList',
      data () {
            return {
              goodsList:[],
              loadingJsonUrl:'/wap/getUserInvestProductCreditList',
              currPage:'1',
              orderId:'',
              orderStatus:'500',
              isShow:'',
              imgJt:'/static/imgVar/rightJt.svg'
            }
        },
        components:{},//这里注册
        created:function () {
          this.orderId = this.$route.query.orderId;
          this.cliamsNextPage();

        },
        methods: {
              lcdShow:function(creditId){
                  this.isShow=creditId;
              },
              cliamsNextPage:function(){
                var _this = this;
                var dataParam = {
                    orderId: _this.orderId,
                    currPage: _this.currPage,
                    orderStatus: _this.orderStatus,
                };
                $.ajax({
                url : utils.AJAXDOMAINNAME+ '/wap/cliamsNextPage',
                  data :JSON.stringify(dataParam),
                  success : function(res){
                        _this.currPage++;
                        if(res.code==1){
                             res.data.map(function(item){
                                  _this.goodsList.push(item)
                              })
                            if(res.data.length > 0 && res.data.length == 10){
                              _this.showLoadMore = true;
                            }else if(res.data.length < 10){
                              _this.showLoadMore = false;
                            }
                        }
                  }
                })

              },
              formatMoney :function (amount){
                      var result = 0;
                      if(amount !=null){
                          result = amount.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
                      }
                      return result;
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
