import * as constants from './loginByVerificationConstants';
import module from './loginByVerification.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  //component: resolve => require(['./loginByVerification.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
