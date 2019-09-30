import * as constants from './riskWarningsConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./riskWarnings.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
