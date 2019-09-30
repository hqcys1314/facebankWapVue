<template>
    <svg :width="boxSize" :height="boxSize" :viewBox="'0 0 '+ boxSize + ' ' + boxSize + ''">
      <defs>
          <linearGradient id="orange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#FE7A6D"/>
              <stop offset="100%" stop-color="#F0484E"/>
          </linearGradient>
      </defs>

      <!-- <circle id="ball1" :cx="smallCircleX" :cy="smallCircleY" :r="smallCircleSize" fill="#FFFFFF" filter="url(#circleShadow)">
      </circle> -->
<path class="ring" fill="none" x="54" y="7" :r="circleR" stroke="url(#orange)" d="M54,7A64,64,0,1,1,11,71" :stroke-width="circleBorderWidth" />


      <!-- <circle :cx="circleCX" :cy="circleCY" :r="circleR" fill="none" stroke="#BCC2CC" :stroke-width="circleBorderWidth" />
      <path ref="ring" fill="none" :cx="circleOffset" :cy="circleOffset" stroke="#F0484E" id="ring" :stroke-width="circleBorderWidth" /> -->
      <!-- <circle :cx="circleCX" :cy="circleCY" :r="circleR2" fill="#FFFFFF" stroke-width="0" /> -->
      <!-- <circle :cx="-circleCX" :cy="-circleCY" :r="circleR" fill="none" stroke="url(#orange)"  :stroke-width="circleBorderWidth" stroke-dasharray="401.92" stroke-dashoffset="0" transform="rotate(90),scale(-1,1)" /> -->
      <!-- <text :x="textPos" :y="textPos" text-anchor="middle" dominant-baseline="ideographic" fill="#F0484E" style="font-size: 1.375rem;font-family: 'Arial';">{{data}}%</text>
      <text :x="textPos" :y="textPos" text-anchor="middle" dominant-baseline="hanging" fill="#848899" style="font-size: .625rem">剩余债权(个)</text>
      <image xlink:href="/static/imgVar/progressCircle.png" :x="smallCircleX" :y="smallCircleY" :height="smallCircleSize" :width="smallCircleSize" /> -->
　　　　</svg>
</template>
<script>
    export default {
      name: 'progressCircle',
      props: ['data'],
      data () {
          return {
              boxSize : 0,
              smallCircleSize : 0,
              circleCX : 0,
              circleCY : 0,
              circleR : 0,
              circleR2 : 0,
              circleBorderWidth : 0,
              textPos : 0,
              page : '',
              circleOffset : 0,
          }
      },
      created:function(){
          var rem = parseInt(window.innerWidth / 750 * 32, 10);
          this.boxSize = parseInt(rem * 8.625, 10);
          this.circleR = parseInt(rem * 3.8125, 10);
          this.circleR2 = parseInt(rem * 3.6875, 10);
          this.circleBorderWidth = parseInt(rem * 0.25, 10);
          this.smallCircleSize = parseInt(rem * 0.75, 10);
          this.textPos = parseInt(this.boxSize / 2, 10)
          this.circleCX = parseInt(this.boxSize / 2, 10)
          this.circleCY = parseInt(this.boxSize / 2, 10);
          this.circleOffset = parseInt(rem * 0.25, 10);

          this.smallCircleX = parseInt(this.boxSize/2, 10);
          this.smallCircleY = parseInt(0 + this.circleBorderWidth / 2, 10);
          var _this = this;
          setTimeout(function(){
              _this.path = _this.$refs.ring;
              console.log(_this.path)
              _this.draw(10)
          },500)

      },
      methods:{
          draw(progress){
              console.log(this.path)
            this.path.setAttribute('transform', 'translate('+(this.circleR+this.circleOffset+4)+','+(this.circleR+this.circleOffset+4)+')');
            var degrees = progress * (360/100);
            var rad = degrees* (Math.PI / 180);
            var x = (Math.sin(rad) * this.circleR).toFixed(2) + this.circleOffset;
            var y = -(Math.cos(rad) * this.circleR).toFixed(2) + this.circleOffset;
            var lenghty = window.Number(degrees > 180);
            var descriptions = ['M', 0, 0, 'v', -this.circleR, 'A', this.circleR, this.circleR, 0, lenghty, 1, x, y, 'z'];
            this.path.setAttribute('d', descriptions.join(' '));
          }
      },
      watch : {

      }
    }
</script>
<style scoped>

</style>
