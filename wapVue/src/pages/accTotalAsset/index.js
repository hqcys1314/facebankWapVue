import * as constants from './accTotalAssetConstants';
//import module from './accTotalAsset.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./accTotalAsset.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
