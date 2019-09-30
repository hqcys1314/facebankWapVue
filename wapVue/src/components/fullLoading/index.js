import fullLoadingTpl from './fullLoading.vue';

export default {
    install : function(Vue){
        Vue.component('fullLoading', fullLoadingTpl);
    }
}
