import * as constants from './claimsOutConfirmConstants';
//import module from './claimsOutSuc.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./claimsOutConfirm.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
