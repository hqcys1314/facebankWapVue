<template>
    <div class="page_box">
        <div class="switch_box">
        	<a class="current"><span>红包</span></a>
        </div>
        <div class="bar_desc"><router-link :to="{ name: 'couponExplain'}">卡券说明</router-link></div>
        <div class="page_content">
            <div class="redpack_list">
            	<ul>
                    <li class="redpack_item" v-for="item in redbagList">
                        <a href="javascript:;" @click="utils.toLoanlist()">
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
                        <div class="icon_enter"></div>
                    </li>
                </ul>
            </div>
        </div>
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
    </div>
</template>

<style scoped src="../coupon/coupon.css"></style>
<script>
import * as constants from './myWelfareConstants';
//import {utils} from 'tools';
import informationLayer from '@/components/informationLayer';

  export default {
    name: constants.NAME,
    data() {
      return {
        tab : 1,
        redbagList : [],

        informationLayerContent : '',
        showLayerStatus : false,
        applicableProductFont : ['', '散标','智能推荐', '自动投标', '月月笑'],
        applicableProduct : [],
      }
    },
    filters :{

    },
    created:function () {
        var _this= this;
        $.ajax({
          url : this.utils.AJAXDOMAINNAME+ '/wap/redpackage/list',
            data: JSON.stringify({
                type : 0,
                pageNum : 1,
                pageSize : 200
            }),
            success : function(res){
                if(res.code*1 == 1){
                    _this.redbagList = res.data.redPackageDtoList;
                }else{
                    _this.showLayer(redPackRes.message);
                }
            }
        })
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
    },
    components: {informationLayer}
  }
</script>
