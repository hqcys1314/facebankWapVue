import * as constants from './depositoryConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./depository.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
