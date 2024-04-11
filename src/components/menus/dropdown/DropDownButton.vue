<template>
  <div @click="toggle" v-click-away='onClickAway' >
    <a>Σ</a>
    <slot/>
  </div>
</template>

<script lang='ts'>
import { directive } from 'vue3-click-away'

export default {
  name: "AppDropdown",
  provide() {
    return {
      sharedState: this.sharedState
    };
  },
  data() {
    return {
      sharedState: {
        active: false
      }
    };
  },
  methods: {
    toggle() {
      this.sharedState.active = !this.sharedState.active;
    },
    onClickAway() {
      this.sharedState.active = false;
    }
  },
  directives: {
    ClickAway: directive
  }
}
</script>

