<template>
  <transition name="dropdown-content">
    <div
      v-if="active"
      class="dropdown-content"
    >
      <slot/>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AppDropdownContent",
  inject: ["sharedState"],
  computed: {
    active() {
      return this.sharedState.active;
    }
  }
};
</script>
