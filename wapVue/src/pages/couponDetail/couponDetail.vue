<template>
    <div class="coupon_detail page_box">
        <div class="contents" :class="{'noFooter':!(cardData.card_status*1==1 || redPack.bonusId)}">
            <div class="card_info">


                <div class="card_item" :class="'type_'+cardData.card_type + (cardData.card_status*1==3 ? ' invalid' : '')" v-if="detailType == 1">
                    <div class="box">
                        <div class="name">{{cardData.card_name}}</div>
                        <div class="surplus" v-if="cardData.card_status*1==1">生效中</div>
                        <div class="surplus no_active" v-if="cardData.card_status*1==2">未激活</div>
                        <div class="surplus_invalid" v-if="cardData.card_status*1==3">已失效</div>
                        <div class="infos">
                            <p>
                                <span>{{cardData.card_proportion}}<em>%</em>
                                </span>
                                <i>年化返现比例</i>
                            </p>
                            <p>
                                <span>{{cardData.card_type == 3 ? '无限返现' : cardData.card_type == 2 ? (cardData.card_num*1 - cardData.use_num*1) : (currency(cardData.amount*1 - cardData.use_amount*1))}}<em>{{unitFont[cardData.card_type*1]}}</em>
                                </span>
                                <i>{{descFont[cardData.card_type*1]}}</i>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="redpack_item type_1" v-if="detailType == 2">
                    <div class="box">
                        <div class="name">{{redPack.bonusTitle}}</div>
                        <div class="infos">
                            <p>
                                <span>{{redPack.bonusValue}}<em>{{redPack.bonusModel == 2 ? '%' : redPack.bonusModel == 1 ? '元' : ''}}</em>
                                </span>
                                <i>{{redPack.bonusModel == 2 ? '加息红包' : redPack.bonusModel == 1 ? '返现红包' : ''}}</i>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="base_info" v-if="detailType == 1 && (cardData.details != null)">
                	<p>
                        <em>返现总金额(元)</em>
                        <span>{{cardData.use_amount}}<i v-if="cardData.card_type == 1">/{{cardData.amount}}</i></span>
                    </p>
                    <p>
                        <em>累计返现次数</em>
                        <span v-if="cardData.card_type == 1">{{cardData.use_num}}</span>
                        <span v-if="cardData.card_type == 2">{{cardData.use_num}}<i>/{{cardData.card_num}}</i></span>
                        <span v-if="cardData.card_type == 3">{{cardData.card_num}}</span>
                    </p>
                </div>

                <div v-if="detailType == 1 && (cardData.details != null)">
                    <div class="title2">返现记录</div>

                    <div class="item_box" v-for="item in cardData.details" >
                    	<h2>{{item.amount}}<span>元返现金额</span>
                            <span v-if="item.status*1 == 1" class="status status_1">已到账</span>
                            <span v-else class="status status_2">未到账</span>
                        </h2>
                        <div class="cont">
                        	订单编号  {{item.order_id}}<br>
                        	使用时间  {{item.use_time}}<br>
                        	返现时间  {{item.status*1 != 1 ? '' : item.back_time.substr(0, 10)}}  {{returnTimeFont[cardData.send_type*1]}}时到账
                        </div>
                    </div>
                </div>

                <div v-if="cardData.card_status!='2'">
                    <div class="emptyRecord" v-if="detailType == 1 && (cardData.details==null)">
                        <b>暂无返现记录</b><span>出借可享额外奖励</span>
                    </div>
                </div>


                <div class="title">使用条件</div>
                <div class="desc" v-if="detailType == 1">
                    <dl>
                        <dt>适用期限</dt>
                        <dd>≥{{cardData.order_term}}天</dd>
                    </dl>
                    <dl>
                        <dt>适用金额</dt>
                        <dd>≥{{cardData.min_money | formatNumber}} {{cardData.min_money*1 < 10000 ? '元' : '万元'}}</dd>
                    </dl>
                    <dl>
                        <dt>适用产品</dt>
                        <dd>{{applicableProduct}}</dd>
                    </dl>
                    <dl>
                        <dt>返现时间</dt>
                        <dd>{{returnTimeFont[cardData.send_type*1]}}时到账</dd>
                    </dl>
                    <dl>
                        <dt>有效期</dt>
                        <dd>{{cardData.start_time + '-' + cardData.end_time}}<small v-if="applicableProduct == '自动投标'"><br>备注：关闭自动投标时（或修改自动投标期限时）该卡自动失效</small></dd>
                    </dl>
                </div>
                <div class="desc" v-if="detailType == 2">
                    <dl>
                        <dt>适用期限</dt>
                        <dd>≥{{redPack.bonusEnableDate}}天</dd>
                    </dl>
                    <dl>
                        <dt>适用金额</dt>
                        <!-- <dd v-if="redPack.bonusEnableMoney>0">≥{{redPack.bonusEnableMoney | formatNumber}} {{redPack.bonusEnableMoney*1 < 10000 ? '元' : '万元'}}</dd> -->
                        <dd v-if="redPack.bonusEnableMoney>0">≥{{redPack.bonusEnableMoney}} 元</dd>
                        <dd v-else>无限制</dd>
                    </dl>
                    <dl>
                        <dt>适用产品</dt>
                        <dd>{{applicableProduct}}</dd>
                    </dl>
                    <dl>
                        <dt>有效期</dt>
                        <dd>{{redPack.bonusValidity}}</dd>
                    </dl>
                </div>
            </div>
            <div class=""></div>
        </div>
        <a href="javascript:;" @click="utils.toAutoInvestMatchPage()" v-if="cardData.card_status*1==1 || redPack.bonusId" class="btn_tpl">去出借</a>

        <!--统一提示层-->
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
        </div>

</template>

<style scoped src="../coupon/coupon.css"></style>

<script>
import * as constants from './couponDetailConstants';
import {utils} from 'tools';
import loading from '@/components/loading'
import informationLayer from '@/components/informationLayer'

  export default {
    name: constants.NAME,
    data() {
      return {
          detail : '',
          detailType : '',
          cardData : {},
          redPack : {},
          applicableProductFont : ['', '散标','智能推荐', '自动投标', '月月笑'],
          applicableProduct : [],
          returnTimeFont : ['','订单结清','投资成功'],
          unitFont : ['', '元', '次', ''],
          descFont : ['', '剩余可返金额', '剩余可用次数', '返现不限次数，不限金额'],
          cardCashCount : 0,

          //浮层控制
          informationLayerContent : '',
          showLayerStatus : false,
      }
    },
    filters : {
        formatNumber(num){
            if(num*1<10000){
                return num;
            }else{
                return parseInt((num/10000)*100)/100;
            }
        },
    },
    created:function () {
        var _this = this;
        this.detailType = this.$route.query.type;
        if(this.detailType == 1){
            this.cardId = this.$route.query.cardId;

            $.ajax({
                url : utils.AJAXDOMAINNAME+ '/wap/getBCCardUseRecords',
                data: JSON.stringify({
                    cardId : this.cardId
                }),
                async : false,
                success : function(res){
                    if(res.code*1 == 1){
                        if(res.data){
                            _this.cardData = res.data;
                            let applicableType = _this.cardData.order_type.split(',');
                            for(var i=0; i<applicableType.length; i++){
                                _this.applicableProduct.push(_this.applicableProductFont[applicableType[i]]);
                            }
                            _this.applicableProduct = _this.applicableProduct.join(' ');

                            if(_this.cardData.details && _this.cardData.details.length > 0){
                                _this.cardCashCount = 0;
                                for(var i = 0; i<_this.cardData.details.length; i++){
                                    _this.cardCashCount += _this.cardData.details[i].amount*1;
                                }
                            }
                        }else{
                            _this.showLayer('卡券信息错误');
                        }
                    }else{
                        _this.showLayer(res.message);
                    }
                }
            })


        }else{
            var _this = this;
            setTimeout(function(){
                var jsonData = utils.getCookie('couponRedpackInfo');
                _this.redPack = _this.$route.query/* ? _this.$route.params : eval('('+jsonData+')')*/;
                let applicableType = _this.redPack.bonusEnableProduct.split(',');
                for(var i=0; i<applicableType.length; i++){
                    _this.applicableProduct.push(_this.applicableProductFont[applicableType[i]]);
                }
                _this.applicableProduct = _this.applicableProduct.join(' ')
            },300)

        }

    },
    methods: {
        currency(number){
            return Number(number).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        },
        showLayer(msg){
            this.informationLayerContent = msg
            this.showLayerStatus = true;
        },
    },
    components: {loading, informationLayer}
  }
</script>
