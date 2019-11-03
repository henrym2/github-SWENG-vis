<template>
  <div id="app" class="pt-5">
   <div>
      <ul class="nav nav-tabs">
          <li v-for="page in pages" class="nav-item" v-bind:class="{active: page.active}" v-bind:key="page.id">
              <a class="nav-link active" role="button" v-on:click="changePage(page)">{{page.name}}</a>
          </li>
      </ul>
  </div>
  </div>
</template>

<script>


export default {
  name: 'app',
  components: {
  },
  data: function() {
    return {
      pages: [{name: "Home", id: 0, active: true},
              {name: "Profile", id: 1, active: false},
              {name: "Settings", id: 2, active: false}]
    }
  },
  methods:{
    changePage: function(page){
      this.pages.forEach(p => {
        if(p.id == page.id){
          p.active = true
          page.active = false
        }
      })
    }
  }
}
</script>

<style>

</style>
