import * as constants from './rechargeSucConstants';
//import module from './rechargeSuc.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./rechargeSuc.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
