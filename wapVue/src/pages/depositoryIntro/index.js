import * as constants from './depositoryIntroConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./depositoryIntro.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
