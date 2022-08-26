<template>
  <div id="app"  >
    <Spinner />
  </div>
</template>

<script>
import Spinner from '../../components/layout/Spinner';
import Controller from './CrtLogout';

export default {
  name: 'Home',
  components: {
    Spinner,
    Controller
  },
  data() {
      return {
      }
  },
  methods: Controller.methods,
  created() {
    Controller.init(this);
  },
  mounted(){
      this.$session.destroy();
      this.$router.push('/');
      window.location.href = "?#";
  }
}
</script>

<style>
</style>
