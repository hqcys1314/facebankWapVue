import * as constants from './directInvestSuccessConstants';
import module from './directInvestSuccess.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  //component: resolve => require(['./directInvestSuccess.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
