import * as constants from './automaticBiddingListConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./automaticBiddingList.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
