import * as constants from './claimsOutSucConstants';
//import module from './claimsOutSuc.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./claimsOutSuc.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
