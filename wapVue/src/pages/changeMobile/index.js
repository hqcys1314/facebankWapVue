import * as constants from './changeMobileConstants';
//import module from './changeMobile.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./changeMobile.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
