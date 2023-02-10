<template>
  <div class="v-application" data-app>
    <!-- <page-header /> -->
    <Sidebar />
    <nuxt class="main" />
    <!-- <page-footer /> -->
  </div>
</template>

<script>
// import pageHeader from '@/components/Header'
// import pageFooter from '@/components/Footer'
import Sidebar from "@/components/Sidebar";
export default {
  components: {
    // pageHeader,
    // pageFooter
    Sidebar
  }
};
</script>

<style lang="scss">
.main {
  min-height: 90vh;
  width: calc(100vw - 280px);
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 25px 0 15px;
}
</style>
