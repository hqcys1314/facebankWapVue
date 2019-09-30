import * as constants from './orderDynamicConstants';
export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./orderDynamic.vue'], resolve),

  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
