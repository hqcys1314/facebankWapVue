import * as constants from './autoInvestMatchDebtConstants';
//import module from './autoInvestMatchDebt.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./autoInvestMatchDebt.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
