import * as constants from './scLoadingConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./scLoading.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
