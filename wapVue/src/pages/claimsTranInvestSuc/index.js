import * as constants from './claimsTranInvestSucConstants';
//import module from './claimsTranInvestCreditorList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./claimsTranInvestSuc.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
