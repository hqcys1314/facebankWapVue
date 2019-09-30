<template>
    <span>
      <!-- 100000	出借人充值	充值	1	充值  -->
      <i v-if="journalTypeId=='100000'" class="iconfont icon-chongzhi" :class="colorCodeValue"></i>

      <!-- 300100	投资人冻结	出借	1	出借  -->
      <i v-else-if="journalTypeId=='300100'" class="iconfont icon-chujie" :class="colorCodeValue"></i>

      <!--  200100	出借人提现	提现	1	提现
            200200	出借人提现手续费	提现手续费	1	提现 -->
            <!--200500 	出借人提现退回	提现退回	4	提现冻结 -->
      <i v-else-if="(journalTypeId=='200100'||journalTypeId=='200500'||journalTypeId=='200200') && colorCode != '4'"
         class="iconfont icon-tixian" :class="colorCodeValue"></i>
      <!-- 	出借人提现退回	提现退回	4	提现冻结 -->
     <i v-else-if="journalTypeId=='200100' && colorCode == '4'"
         class="iconfont icon-tixianfanhui" :class="colorCodeValue"></i>

      <!-- 400200	投资现金红包兑现	现金奖励	1	奖励
            400300	现金红包资金结转	现金奖励	1	奖励
            410200	加息红包，兑现	加息奖励	1	奖励
            410300	加息红包，账户资金结转	加息奖励	1	奖励
            420200	合伙人红包，兑现	合伙人奖励	1	奖励
            420600  体验金利息，账户资金结转
            601400	正常还款,出借人红包还款-个人	加息奖励	1	奖励
            611800	提前还款,出借人红包还款-个人	加息奖励	1	奖励
            621500	代偿还款,出借人红包还款-个人	加息奖励	1	奖励
            999999	各种活动奖励	XXX活动奖励	1	奖励
            601500	新系统打穿还款出借人加息还款平台	1	奖励
            611900	新系统打穿提前还款出借人加息还款平台1	奖励
          -->
     <i v-else-if="journalTypeId=='400200'||journalTypeId=='400300'||journalTypeId=='410200'
     ||journalTypeId=='410300'||journalTypeId=='420200'||journalTypeId=='420500'||journalTypeId=='601400'||journalTypeId=='611800'
     ||journalTypeId=='621500'||journalTypeId=='601500'||journalTypeId=='611900'"
        class="iconfont icon-hongbao" :class="colorCodeValue"></i>

     <!--  300200	募集期流标	流标退款	1	回款
           500300	放款到自然人满标流标	流标退款	1	回款
           510300	放款到供应商满标流标	流标退款	1	回款
           520300	放款到企业满标流标	流标退款	1	回款
           600100	正常还款到冻结	还款	1	回款
           601200	正常还款订单还本金	还本金	1	回款
           601300	正常还款订单还利息	还利息	1	回款
           611600	提前还款订单还本金	还本金	1	回款
           611700	提前还款订单还利息	还利息	1	回款
           620100	代偿还本金	代偿还本金	1	回款
           620200	代偿还利息	代偿还利息	1	回款
           621300	代偿订单还款还本金	还本金	1	回款
           621400	代偿订单还款还利息	还利息	1	回款 -->
     <i v-else-if="journalTypeId=='300200'||journalTypeId=='500300'||journalTypeId=='510300'
     ||journalTypeId=='520300'||journalTypeId=='600100'||journalTypeId=='601200'||journalTypeId=='601300'
     ||journalTypeId=='611600'||journalTypeId=='611700'||journalTypeId=='620100'||journalTypeId=='620200'
     ||journalTypeId=='621300' ||journalTypeId=='621400' ||journalTypeId=='200606' ||journalTypeId=='200618'"
         class="iconfont icon-huikuan" :class="colorCodeValue"></i>
     <i v-else-if="journalTypeId=='800000'"
         class="iconfont icon-rengong" :class="colorCodeValue"></i>

      <!--默认展示-->
      <i v-else class="iconfont icon-moren" :class="colorCodeValue"></i>
    </span>
</template>
<script>
    export default {
      name: 'transRec',
      data () {
            return {
              colorCodeValue:'left-color-block',
            }
          },
      props: ['journalTypeId','colorCode'],
      created(){
           if(this.colorCode=='1'){
             this.colorCodeValue='left-color-red';
           }else if(this.colorCode=='2') {
             this.colorCodeValue='left-color-green';
           }else if(this.colorCode=='4') {
             this.colorCodeValue='left-color-orange';
           }else{
             this.colorCodeValue='left-color-grey';
           }
      }
    }
</script>
<style scoped>
.listBox ul li .icon_box  i.iconfont{font-size: 1.6rem;float:left;}
.listBox ul li .icon_box .left-color-green{color:#44bf97;}
.listBox ul li .icon_box .left-color-red{color:#fc6a42;}
.listBox ul li .icon_box .left-color-grey{color:#ced2d8;}
.listBox ul li .icon_box .left-color-orange{color:#FC6A42;}
</style>
