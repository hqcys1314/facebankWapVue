import * as constants from './claimsOutOrderStatusConstants';
//import module from './claimsOutSuc.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./claimsOutOrderStatus.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
