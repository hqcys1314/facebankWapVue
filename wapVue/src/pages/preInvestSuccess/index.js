import * as constants from './preInvestSuccessConstants';
//import module from './preInvestSuccess.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./preInvestSuccess.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
