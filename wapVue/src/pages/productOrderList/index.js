import * as constants from './productOrderListConstants';
//import module from './productOrderList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./productOrderList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
