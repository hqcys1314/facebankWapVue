import * as constants from './changeMobileSmsConstants';
//import module from './changeMobileSms.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./changeMobileSms.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
