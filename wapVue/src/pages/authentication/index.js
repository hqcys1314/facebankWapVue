import * as constants from './authenticationConstants';
import module from './authentication.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  //component: resolve => require(['./authentication.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
