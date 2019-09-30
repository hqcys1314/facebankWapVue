import * as constants from './depositoryQaConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./depositoryQa.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
