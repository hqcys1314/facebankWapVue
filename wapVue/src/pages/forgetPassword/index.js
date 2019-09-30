import * as constants from './forgetPasswordConstants';
//import module from './forgetPassword.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./forgetPassword.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
