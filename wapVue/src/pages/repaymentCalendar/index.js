import * as constants from './repaymentCalendarConstants';
//import module from './repaymentCalendar.vue';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: resolve => require(['./repaymentCalendar.vue'], resolve),
  meta: {
    title: constants.TITLE,
    requireAuth: constants.REQUIRE_AUTH
  },
  constants
};
