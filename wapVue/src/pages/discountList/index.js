import * as constants from './discountListConstants';
//import module from './discountList.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./discountList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
