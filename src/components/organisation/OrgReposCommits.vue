<template>
  <div class="card ml-1 shadow d-flex">
      <h5 class="m-3 card-title">
          Repository Contributions
      </h5>
  <div class="card-bodu m-auto">
      <span v-if="loading" class="spinner-border text-primary d-flex justify-self-center align-self-center m-auto" role="status" aria-hidden="true" style="width:5rem;height:5rem"></span>
      <div id="repo_stats_graph" v-show="!loading"></div>
  </div>
  </div>
</template>

<script>
const Plotly = require("plotly.js-dist");
export default {
    name: "OrgReposCard",
    data: function(){
        return {
            repoStats: null,
            loading: false
        }
    },
    props:{
        orgName: String
    },
    watch: {
        orgName: function(){
            this.getRepoCommits()
        }
    },
    created: function() {
        this.getRepoCommits()
    },
    methods: {
        getRepoCommits(){
            this.loading = true
            let promises = [];
            this.$octokit.repos.listForOrg({
                org: this.orgName,
                sort: "updated",
                type: "public",
                per_page: 100
            }).then(res => {
                let repos = res.data.map(e => e.name);
                this.repoStats = res.data.map(e => {
                    let obj = {}
                    obj["name"] = e.name
                    obj["commits"] = 0
                    return obj
                    });
                repos.forEach(e => {
                    promises.push(this.$octokit.repos.listContributors({ 
                        owner: this.orgName,
                        repo: e}
                    ))
                })
                Promise.all(promises).then(repoCommits => {
                    repoCommits.forEach((repo, index) => {
                        let initialValue = 0
                        this.repoStats[index]["commits"] = repo.data.reduce(
                            (accumulator, currentValue) => accumulator + currentValue.contributions
                            ,initialValue
                        )
                    })
                    //eslint-disable-next-line
                    console.log(this.repoStats)
                    this.createGraph()
                    this.loading = false
                })
            }).catch(err => {
                //eslint-disable-next-line
                console.log(err)
            })
        },
        createGraph: function() {
            //eslint-disable-next-line
            console.log(this.repoStats)
            let min = Math.min(...this.repoStats.map(e => e.commits))
            let trace = {
                y: this.repoStats.map(e => e.commits).filter(e => {return e != min}),
                x: this.repoStats.map(e => e.name),
                type: 'histogram',
                histfunc: "sum",
                hoverinfo: "x+y"
            }
            let data = [trace]
            Plotly.newPlot('repo_stats_graph', data);
    }
    },
    
}
</script>

<style>

</style>