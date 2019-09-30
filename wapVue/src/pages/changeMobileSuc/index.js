import * as constants from './changeMobileSucConstants';
//import module from './changeMobileSuc.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./changeMobileSuc.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
