import * as constants from './autoInvestMatchDebtOnSaleConstants';
//import module from './autoInvestMatchDebtOnSale.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./autoInvestMatchDebtOnSale.vue'], resolve),

  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
