import * as constants from './discountConstants';
//import module from './discount.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./discount.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
