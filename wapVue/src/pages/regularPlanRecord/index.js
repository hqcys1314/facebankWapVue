import * as constants from './regularPlanRecordConstants';
//import module from './regularPlanRecord.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./regularPlanRecord.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
