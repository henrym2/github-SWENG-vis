<template>
  <div id="app" class="pt-1">
    <div class="navbar navbar-expand-lg navbar-light bg-light mb-2">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-secondary" v-bind:class="{active: page.active}" v-for="page in pages" v-bind:key="page.id">
              <input type="radio" name="options" id="option1" autocomplete="off" v-on:click="changePage(page)"> {{page.name}}
          </label>
        </div>
        <div class="form-inline ml-auto">
            <input class="form-control mr-sm-2" type="search" placeholder="Username" v-model="currentUser">
            <button class="btn my-2 my-sm-0" type="submit" v-on:click=";loadingUser = true;findUser()" :class="error ? 'btn-outline-danger' : 'btn-outline-primary'">
              <span v-if="loadingUser" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Search</button>
        </div>
      </div>
      <div class="d-flex flex-row pl-1" v-if="userData">
        <div class="d-flex flex-column flex-wrap">
          <UserCard v-bind:userData="userData"></UserCard>
          <StarredRepos class="mt-1" v-bind:userName="userData.login"></StarredRepos>
        </div>
        <PunchCard v-bind:currentUser="userData.login" class="d-flex"></PunchCard>
      </div>
      <b-alert
      v-model="error"
      class="position-fixed fixed-bottom m-0 rounded-0"
      style="z-index: 2000;"
      variant="danger"
      dismissible
    >
      An error has occured! Your last gitApi request failed. Try a different username or maybe re-connect to the network.
    </b-alert>
  </div>
</template>

<script>
import UserCard from "../src/components/UserCard"
import StarredRepos from "../src/components/StarredRepos"
import PunchCard from "../src/components/PunchCard"


export default {
  name: 'app',
  components: {
    UserCard,
    StarredRepos,
    PunchCard
  },
  data: function() {
    return {
      pages: [{name: "Home", id: 0, active: true},
              {name: "Profile", id: 1, active: false},
              {name: "Settings", id: 2, active: false}
              ],
      currentUser: "",
      userData: null,
      loadingUser: false,
      error: false
    }
  },
  methods:{
    changePage: function(page){
      this.pages.forEach(p => {
        if(p.id == page.id){
          p.active = true
        }else{
          p.active = false
        }
      })
    },
    findUser: function() {
      if(this.currentUser != ""){
        this.$octokit.users.getByUsername({
          username: this.currentUser
        }).then((res) => {
          this.loadingUser = false
          this.error = false
          this.userData = res.data
        }).catch(err => {
          //eslint-disable-next-line
          console.log(err)
          this.loadingUser = false
          this.error = true
        })
      }
    },
  }
}
</script>

<style>

</style>
