import * as constants from './aConstants';
//import module from './claimsTranInvestCreditorList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./a.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
