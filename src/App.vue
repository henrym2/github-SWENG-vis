<template>
  <div id="app" class="pt-1">
    <transition name="leave" leave-active-class="slide-leave-active">
      <LandingPage v-if="!landed" v-on:click.native="landed=true"></LandingPage>
    </transition>
    <div v-if="landed" class="navbar navbar-expand-lg navbar-light bg-light mb-2">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-secondary" v-bind:class="{active: page.active}" v-for="page in pages" v-bind:key="page.id">
              <input type="radio" name="options" v-bind:id="'nav-button-'+page.id" autocomplete="off" v-on:click="changePage(page)"> {{page.name}}
          </label>
        </div>
        <div class="form-inline ml-auto">
          <form @submit.prevent>
            <input class="form-control mr-sm-2" type="search" placeholder="Username" v-model="currentUser" id="user_search">
            <button class="btn my-2 my-sm-0" type="submit" id="search_button" v-on:click=";loadingUser = true;findUser();" :class="error ? 'btn-outline-danger' : 'btn-outline-primary'">
              <span v-if="loadingUser" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Search</button>
              </form>
        </div>
      </div>
      <div class="d-flex flex-row pl-2" v-if="userData && pages[0].active">
        <div class="d-flex flex-column flex-wrap fade-in-left">
          <UserCard v-bind:userData="userData"></UserCard>
          <StarredRepos class="mt-1" v-bind:userName="userData.login"></StarredRepos>
        </div>
        <PunchCard v-bind:currentUser="userData.login" class="d-flex fade-in-top" id="card_punch" ></PunchCard>
        <div class="d-flex flex-column pl-1">
          <ScoreCard v-bind:currentUser="userData" class="d-flex fade-in-top"></ScoreCard>
          <LanguageCard v-bind:userName="userData.login" class="d-flex fade-in-bottom mt-1"></LanguageCard>
        </div>
      </div>
      <div class="d-flex flex-row pl-2" v-if="pages[2].active">
        <div class="d-flex flex-column flex-wrap fade-in-left">
          <InfoCard></InfoCard>
        </div>
      </div>
      <div class="d-flex flex-row pl-2" v-if="pages[1].active && userData != null">
        <div class="d-flex flex-column flex-wrap fade-in-left">
          <UserCard v-bind:userData="userData" v-bind:isOrg="true"></UserCard>
        </div>
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
import UserCard from "../src/components/shared/UserCard"
import StarredRepos from "../src/components/user/StarredRepos"
import PunchCard from "../src/components/user/PunchCard"
import ScoreCard from "../src/components/user/ScoreCard"
import LanguageCard from "../src/components/user/LanguageCard"
import InfoCard from "../src/components/InfoCard"
import LandingPage from "../src/components/LandingPage"


export default {
  name: 'app',
  components: {
    UserCard,
    StarredRepos,
    PunchCard,
    ScoreCard,
    LanguageCard,
    InfoCard,
    LandingPage
  },
  data: function() {
    return {
      pages: [
              {name: "Profiles", id: 0, active: true},
              {name: "Organisations", id: 1, active: false},
              {name: "About", id: 2, active: false}
              ],
      currentUser: "",
      userData: null,
      loadingUser: false,
      error: false,
      landed: false,
      isOrg: false
    }
  },   
  methods:{
    changePage: function(page){
      this.userData = null
      this.currentUser = ""
      this.pages.forEach(p => {
        if(p.id == page.id){
          if(p.id == 1){
            this.isOrg = true
          }else{
            this.isOrg = false
          }
          p.active = true
        }else{
          p.active = false
        
        }
      })
    },
    findUser: function() {
      if(this.currentUser != "" && this.isOrg == false){
        this.$octokit.users.getByUsername({
          username: this.currentUser
        }).then((res) => {
          this.loadingUser = false
          this.error = false
          this.userData = res.data
          //eslint-disable-next-line
          console.log(res.data, this.isOrg)
        }).catch(err => {
          //eslint-disable-next-line
          console.log(err)
          this.loadingUser = false
          this.error = true
        })
      }else if(this.currentUser != ""){
        this.$octokit.orgs.get({
          org: this.currentUser
        }).then((res) => {
          this.loadingUser = false
          this.error = false
          //eslint-disable-next-line
          console.log(res.data)
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

.fade-in-left {
	-webkit-animation: fade-in-left 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  /*eslint-disable-next-line*/
	animation: fade-in-left 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
/**
 * ----------------------------------------
 * animation fade-in-left
 * ----------------------------------------
 */
@-webkit-keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
            transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}
@keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
            transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}

.fade-in-top {
	-webkit-animation: fade-in-top 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-top 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
/**
 * ----------------------------------------
 * animation fade-in-top
 * ----------------------------------------
 */
@-webkit-keyframes fade-in-top {
  0% {
    -webkit-transform: translateY(-50px);
            transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
}
@keyframes fade-in-top {
  0% {
    -webkit-transform: translateY(-50px);
            transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
}

.fade-in-bottom {
	-webkit-animation: fade-in-bottom 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-bottom 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

@-webkit-keyframes fade-in-bottom {
  0% {
    -webkit-transform: translateY(50px);
            transform: translateY(50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
}
@keyframes fade-in-bottom {
  0% {
    -webkit-transform: translateY(50px);
            transform: translateY(50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
}

.slide-leave-active {
	-webkit-animation: slide-out-bottom 1s cubic-bezier(0.950, 0.050, 0.795, 0.035) both;
	animation: slide-out-bottom 1s cubic-bezier(0.950, 0.050, 0.795, 0.035) both;
}

/**
 * ----------------------------------------
 * animation slide-out-bottom
 * ----------------------------------------
 */
@-webkit-keyframes slide-out-bottom {
  0% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(1000px);
            transform: translateY(1000px);
    opacity: 0;
  }
}
@keyframes slide-out-bottom {
  0% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(1000px);
            transform: translateY(1000px);
    opacity: 0;
  }
}


</style>
