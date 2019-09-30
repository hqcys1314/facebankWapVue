import * as constants from './riskWarnings2Constants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./riskWarnings2.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
