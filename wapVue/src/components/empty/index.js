import emptyTpl from './empty.vue';

export default {
    install : function(Vue){
        Vue.component('empty', emptyTpl);
    }
}
