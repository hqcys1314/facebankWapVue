import * as constants from './successPageConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./successPage.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
