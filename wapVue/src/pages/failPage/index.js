import * as constants from './failPageConstants';
//import module from './failPage.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./failPage.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
