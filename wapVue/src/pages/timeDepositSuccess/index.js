import * as constants from './timeDepositSuccessConstants';
import module from './timeDepositSuccess.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: module,
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
