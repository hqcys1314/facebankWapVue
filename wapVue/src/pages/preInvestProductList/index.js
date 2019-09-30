import * as constants from './preInvestProductListConstants';
//import module from './preInvestProductList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./preInvestProductList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
