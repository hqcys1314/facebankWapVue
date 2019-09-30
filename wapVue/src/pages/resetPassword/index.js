import * as constants from './resetPasswordConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./resetPassword.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
