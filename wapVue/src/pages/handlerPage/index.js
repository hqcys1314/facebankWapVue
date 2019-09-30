import * as constants from './handlerPageConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./handlerPage.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
