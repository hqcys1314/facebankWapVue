import * as constants from './couponExplainConstants';
//import module from './couponExplain.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./couponExplain.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
