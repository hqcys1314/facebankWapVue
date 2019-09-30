<template>
  <div>
    <ul class="list-type-1">
       <li v-for="dpd in directInvestProjectDetailResult">
         <a :href="'/directInvestProjectDetailShow?productId='+ productId +'&loanId='+dpd.loanId">
         <div class="info">{{dpd.loanNum}}</div>
         <div class="user_info">
           <p>{{dpd.borrowerName}}<small>借款人</small></p>
          <p>{{dpd.borrowerIdcard.substr(0,4)}}******{{dpd.borrowerIdcard.substr(-4)}}<small>借款人身份证</small></p>
          <p>{{dpd.amount}}<small>借款金额(元)</small></p>

         </div>
         </a>
       </li>
     </ul>
  </div>
</template>

<style src="./directInvestProjectDetail.css"></style>

<script>
  import * as constants from './directInvestProjectDetailConstants';
  import {utils,globalVariable} from'tools'

  export default {
    name: constants.NAME,
    data() {
      return {
          directInvestProjectDetailJsonUrl:"/wap/getLoanListForSeparateProduct",
          directInvestProjectDetailResult:'',
          productId:'',
      }
    },
    created:function () {
         this.productId = this.$route.query.productId;
          //获取首页消息
          var _this = this;
          $.ajax({
  			 url : utils.AJAXDOMAINNAME+ _this.directInvestProjectDetailJsonUrl,
  			  data : '{"productId":"'+ _this.productId +'"}',
  			  success : function(res){
  				  if(res.code==1){
  					  _this.directInvestProjectDetailResult=res.data.retailLoanModelDtoList;
  				  }
  			  }
  		})

    },
    methods: {

    },
    components: {}
  }
</script>
