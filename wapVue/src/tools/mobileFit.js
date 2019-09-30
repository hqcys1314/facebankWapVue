//手机全适配
export default function(){
    let d = document, w = window,
        el = d.documentElement,
        webSetFont = el.currentStyle ? el.currentStyle['fontSize'] : getComputedStyle(el,false)['fontSize'],
        ratio = parseFloat(webSetFont) / 16,
        resizeEvt = 'orientationchange' in w ? 'orientationchange' : 'resize',
        clientWidth, lastFontSize;

    function resizeFont(){
        clientWidth = el.clientWidth;
        lastFontSize = (clientWidth < 750 ? (32 * (clientWidth / 750) / ratio) : 16) + 'px';
        el.style.fontSize = lastFontSize;
    }
    w.addEventListener(resizeEvt, resizeFont, false);
    d.addEventListener('DOMContentLoaded', resizeFont, false);
};
