import * as constants from './timeDepositDebtConstants';
//import module from './autoInvestMatchDebt.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./timeDepositDebt.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
