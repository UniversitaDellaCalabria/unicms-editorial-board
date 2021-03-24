<template>
  <footer class="footer">
    <div class="container-fluid">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{path:'/'}">Dashboard</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        <b-icon icon="github"></b-icon> Contribute to:
        <a href="https://github.com/UniversitaDellaCalabria/uniCMS" target="_blank">
            uniCMS
        </a>
        /
        <a href="https://github.com/UniversitaDellaCalabria/unicms-editorial-board" target="_blank">
            uniCMS editorial board
        </a>
      </div>
    </div>
  </footer>
</template>
<script>
  export default {}

</script>
<style>

</style>
