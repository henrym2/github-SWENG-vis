<template>
  <div class="card shadow d-flex">
      <div class="card-body">
          <h5 class="card-title">
              Language Stats
          </h5>
          <div id="language_stats"></div>
      </div>
  </div>
</template>

<script>
export default {
    name: "LanguageCard",
    data: function(){
        return {
            languageStats: null
        }
    },
    props: {
        userName: String 
    },
    watch: {
        currentUser: function() {
            this.getLanguageStats()
        }
    },
    mounted () {
        this.getLanguageStats()
    },
    methods: {
        getLanguageStats() {
            let promises = [];
            this.$octokit.repos.listForUser({
                username: this.userName
            }).then(res => {
                let userRepos = res.data.map(e => e.name);
                userRepos.forEach(e => {
                    promises.push(this.$octokit.repos.listLanguages({
                        owner: this.userName,
                        repo: e
                    }))
                })
                Promise.all(promises).then(repoStats => {
                    //eslint-disable-next-line
                    this.languageStats = repoStats.map(e =>    
                            e.data
                    ).filter(e => Object.keys(e).length)
                })
            })
        }
    }
}
</script>

<style>

</style>