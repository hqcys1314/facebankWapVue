import * as constants from './claimsTranInvestDetailConstants';
//import module from './claimsTranInvestDetail.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./claimsTranInvestDetail.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
