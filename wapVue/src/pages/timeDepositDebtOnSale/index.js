import * as constants from './timeDepositDebtOnSaleConstants';
//import module from './autoInvestMatchDebtOnSale.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./timeDepositDebtOnSale.vue'], resolve),

  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
