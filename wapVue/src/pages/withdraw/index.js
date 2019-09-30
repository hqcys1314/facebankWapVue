import * as constants from './withdrawConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./withdraw.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
