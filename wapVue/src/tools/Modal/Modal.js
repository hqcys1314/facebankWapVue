/** 自定义Modal组件
let modal = new Modal({
  template: payMethodModal,
  data: {},
  maskDestroy: true, // default true
  containerClass: '',
  methods: {}
  // 组建声明周期钩子
});

modal.destroy();
 */

import Vue from 'vue';
import './Modal.less';

function tplWrap(template) {
  return '<transition name="modal" mode="out-in">' +
    '<div class="modal" v-show="modalShow" @click="maskTapHandler">' +
    '<div class="modal-container" :class="containerClass" @click.stop>' +
    template +
    '</div></div></transition>';
}

const DEFAULT_CONFIG = {
  maskDestroy: true,
  containerClass: ''
};

// 保留前一个modal的引用
let preModal = null;

class Modal {
  constructor(options = {}) {
    options = {
      ...DEFAULT_CONFIG,
      ...options
    };

    preModal && preModal.destroy();

    let vm = new Vue({
      ...options,
      data: {
        ...options.data,
        containerClass: options.containerClass,
        modalShow: false
      },
      methods: {
        ...options.methods,
        maskTapHandler: () => {this.maskTapHandler()},
        _destroy: () => {this.destroy()}
      },
      el: document.createElement('div'),
      template: tplWrap(options.template)
    });
    preModal = this;

    document.body.appendChild(vm.$el);
    vm.modalShow = true;

    this.options = options;
    this.vm = vm;
  }
  maskTapHandler() {
    if (this.options.maskDestroy) {
      this.destroy();
    }
  }

  destroy() {
    this.vm.$el.parentNode.removeChild(this.vm.$el);
    this.vm.$destroy();
    preModal = null;
  }
}

export default Modal;
