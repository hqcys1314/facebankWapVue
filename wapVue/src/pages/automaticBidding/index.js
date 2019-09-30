import * as constants from './automaticBiddingConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./automaticBidding.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
