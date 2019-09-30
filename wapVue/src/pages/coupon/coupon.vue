<template>
    <div class="page_box">
        <div class="switch_tab">
            <ul style="width:66.66%;margin:0 auto;">
                <li href="javascript:;" @click="switchTab(1)" :class="{'current' : tab==1}"><span>返现卡</span><i></i></li>
                <li href="javascript:;" @click="switchTab(2)" :class="{'current' : tab==2}"><span>红包</span><i></i></li>
            </ul>
        </div>
        <div class="bar_desc"><router-link :to="{ name: 'couponExplain'}">卡券说明</router-link></div>
        <div class="page_content">
        	<div class="coupon_list" v-if="tab==1">
            	<ul v-if="couponCardList.length > 0">
                    <li class="card_item" :class="'type_'+item.card_type + (item.card_status*1==3 ? ' invalid' : '')"
                    v-for="item in couponCardList">
                        <router-link :to="{ name: 'couponDetail', query: {cardId:item.card_id, type:1} }">
                            <div class="box">
                                <div class="name">{{item.card_name}}</div>
                                <div class="surplus" v-if="item.card_status*1==1">生效中</div>
                                <div class="surplus no_active" v-if="item.card_status*1==2">未激活</div>
                                <div class="surplus_invalid" v-if="item.card_status*1==3">已失效</div>
                                <div class="infos">
                                    <p>
                                        <span>{{item.card_proportion}}<em>%</em>
                                        </span>
                                        <i>年化返现比例</i>
                                    </p>
                                    <p>
                                        <span>{{item.card_type == 3 ? '无限返现' : item.card_num}}<em>{{unitFont[item.card_type*1]}}</em>
                                        </span>
                                        <i>{{descFont[item.card_type*1]}}</i>
                                    </p>
                                </div>
                            </div>
                            <div class="icon_enter"></div>
                        </router-link>
                    </li>
                </ul>
                <div v-else class="empty_box">
                    <div class="img_box"><img src="//static.facebank.cn/static/wapFront/common/images/empty_record.png" /></div>
                    <div class="font"><span class="bold">当前没有可用返现卡哦</span><br>特殊情况返现卡发送可能有所延迟</div>
                </div>
            </div>

            <div class="redpack_list" v-if="tab==2">
            	<ul v-if="redbagList.length > 0">
                	<li class="redpack_item" :class="" v-for="item in redbagList">
                        <a href="javascript:;">
                            <!-- <a href="javascript:;" @click="viewDetail(item)"> -->
                            <div class="box">
                                <div class="name">{{item.bonusTitle}}</div>
                                <div class="infos">
                                    <p>
                                        <span>{{item.bonusValue}}<em>{{item.bonusModel == 2 ? '%' : item.bonusModel == 1 ? '元' : ''}}</em>
                                        </span>
                                        <i>{{item.bonusModel == 2 ? '加息红包' : item.bonusModel == 1 ? '返现红包' : ''}}</i>
                                    </p>
                                </div>
                            </div>
                            <div class="detailInfo">
                                <p><span>适用期限</span>{{item.bonusEnableDate}}天以上</p>
                                <p><span>适用产品</span>{{getApplicable(item.bonusEnableProduct)}}</p>
                                <p><span>适用金额</span>{{item.bonusEnableMoney*1>0 ? item.bonusEnableMoney + '元以上' : '无限制'}}</p>
                                <p><span>有效期</span>{{item.bonusValidity}}</p>
                            </div>
                        </a>
                        <!-- <div class="icon_enter"></div> -->
                    </li>
                </ul>
                <div v-else class="empty_box">
                    <div class="img_box"><img src="//static.facebank.cn/static/wapFront/common/images/empty_record.png" /></div>
                    <div class="font"><span class="bold">当前没有可用红包哦</span><br>特殊情况红包发送可能有所延迟</div>
                </div>

            </div>
        </div>
        <smileLoading  :showSmileLoading.sync="loadingLayerStatus"></smileLoading>
        <!--统一提示层-->
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
    </div>
</template>

<style scoped src="./coupon.css"></style>
<script>
import * as constants from './couponConstants';
import {utils} from 'tools';
import loading from '@/components/loading'
import informationLayer from '@/components/informationLayer'

  export default {
    name: constants.NAME,
    data() {
      return {
        redbagList : [],
        couponCardList : [],
        tab : 1,
        unitFont : ['', '元', '次', ''],
        descFont : ['', '剩余可返金额', '剩余可用次数', '返现不限次数，不限金额'],
        applicableProductFont : ['', '散标','智能推荐', '自动投标', '月月笑'],
        applicableProduct : [],

        //浮层控制
        informationLayerContent : '',
        showLayerStatus : false,
        layerMaskStatus : false,

        loadingLayerStatus : false, //loading弹层状态
      }
    },
    filters :{

    },
    created:function () {
        utils.setCookie('couponRedpackInfo', '', -1)
        var _this = this;
        this.loadingLayerStatus = true;
        var tab = this.$route.query.tab;
        if(tab){
            this.tab = tab < 1 ? 1 : tab > 2 ? 2 : tab;
        }
        try{
            window.scrollTo(0,0,0)
        }catch(err){
            window.scrollTo(0,0)
        }
        $.when(this.getRedPackList(), this.getCouponCardList()).then(function(redPackRes, couponCardRes){
            _this.loadingLayerStatus = false;
            if(redPackRes.code*1 == 1){
                var redPack = redPackRes.data.redPackageDtoList;
                if (redPack != "" || redPack != null) {
                    _this.redbagList = redPack;
                    for(let key in _this.redbagList){
                        _this.redbagList[key]['enable'] = false;
                    }
                    _this.redbagCount = redPack.length;
                }
            }else{
                _this.showLayer(redPackRes.message);
            }

            if(couponCardRes.code*1 == 1){
                var couponCard = couponCardRes.data;
                if (couponCard != null && couponCard.cardList != "") {
                    _this.couponCardList = couponCard;
                    var active = 0;
                    for(let key in _this.couponCardList){
                        _this.couponCardList[key]['enable'] = true;
                        if(_this.couponCardList[key].card_status*1!=3){
                            active++;
                        }
                    }
                    if(active == 0 && !tab){
                        _this.tab = 2;
                    }
                    _this.couponCardCount = couponCard.length;
                }else{
                    _this.tab = 2;
                }
            }else{
                _this.showLayer(couponCardRes.message);
            }
        })
    },
    mounted(){

    },
    methods: {
        getApplicable(bonusEnableProduct){
            let applicableType = bonusEnableProduct.split(',');
            var applicableProduct = [];
            for(var i=0; i<applicableType.length; i++){
                applicableProduct.push(this.applicableProductFont[applicableType[i]]);
            }
            return applicableProduct.join('/');
        },
        showLayer(msg){
            this.informationLayerContent = msg
            this.showLayerStatus = true;
        },
        switchTab(tab){
            this.tab = tab;
        },
        //获取列表
        getRedPackList(){
            var _this= this;
            var def = $.Deferred();
            $.ajax({
              url : utils.AJAXDOMAINNAME+ '/wap/redpackage/list',
                data: JSON.stringify({
                    type : 0,
                    pageNum : 1,
                    pageSize : 200
                }),
                success : function(res){
                    def.resolve(res);
                }
            })
            return def.promise();
        },
        getCouponCardList(){
            var _this= this;
            var def = $.Deferred();
            $.ajax({
              url : utils.AJAXDOMAINNAME+ '/wap/getUserAllBCCard',
                data: JSON.stringify({
                    type : 1
                }),
                success : function(res){
                    def.resolve(res);
                }
            })
            return def.promise();
        },
        viewDetail(item){
            if(item.bonusId) return;
            var params = {};
            for(let key in item){
                params[key] = item[key]
            }
            item['type'] = 2;
            var jsonData = JSON.stringify(params);
            utils.setCookie('couponRedpackInfo', jsonData, 1)
            this.$router.push({
                path : '/couponDetail',
                params : params,
                query : item
            })
        }
    },
    components: {loading, informationLayer}
  }
</script>
