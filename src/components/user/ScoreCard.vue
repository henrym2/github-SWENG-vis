<template>
  <div id="ScoreCard" class="card d-flex shadow">
      <div class="card-body d-flex flex-column">
          <h5 class="card-title">Score Card</h5>
          <div class="d-flex flex-row">
            <p >Followers: {{currentUser.followers}}</p>
            <p class="ml-2">Following: {{currentUser.following}}</p>
            <p class="ml-2">Starred: {{starred}}</p>
            <p class="ml-2">Projects: {{projects}}</p>
            <p class="ml-2">Public-Repos: {{currentUser.public_repos}}</p>
            <p class="ml-2">Public-Gists: {{currentUser.public_gists}}</p>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: "ScoreCard",
    props:{
        currentUser: Object,
    },
    mounted() {
       
            this.getTotalStats()
        
    },
    watch: {
        currentUser: function(){
            this.getTotalStats()
        }
    },
    data: function(){
        return {
            starred: 0,
            projects: 0
        }
    },
    methods: {
        getTotalStats: function(){
            let promises = []
            promises.push(this.$octokit.activity.listReposStarredByUser({
                username: this.currentUser.login,
                sort:     "updated",
            }))
            promises.push(this.$octokit.projects.listForUser({
                username: this.currentUser.login
            }))
            Promise.all(promises).then(resps => {
                this.starred = resps[0].data.length
                this.projects = resps[1].data.length
            })
                
        }
    }
}
</script>

<style>

</style>