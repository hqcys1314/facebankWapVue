import * as constants from './cardListConstants';
export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./cardList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
