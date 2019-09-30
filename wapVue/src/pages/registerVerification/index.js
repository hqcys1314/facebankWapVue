import * as constants from './registerVerificationConstants';
import module from './registerVerification.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  // component: resolve => require(['./registerVerification.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
