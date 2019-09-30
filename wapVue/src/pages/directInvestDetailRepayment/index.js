import * as constants from './directInvestDetailRepaymentConstants';
//import module from './directInvestDetailRepayment.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./directInvestDetailRepayment.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
