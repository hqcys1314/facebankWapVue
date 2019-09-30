import * as constants from './couponConstants';
//import module from './coupon.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./coupon.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
