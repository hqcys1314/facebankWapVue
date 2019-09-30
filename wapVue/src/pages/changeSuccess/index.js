import * as constants from './changeSuccessConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./changeSuccess.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
