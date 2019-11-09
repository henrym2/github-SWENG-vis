<template>
  <div class="card ml-1 shadow">
    <div class="card-body">
      <h5 class="card-title">Punch Card</h5>
      <div id="punch_card"></div>
    </div>
  </div>
</template>

<script>
const d3 = require("d3");

export default {
  data: function() {
    return {
      punchCardData: null
    };
  },
  mounted: function() {
    this.getPunchData();
  },
  props: {
    currentUser: String
  },
  watch: {
    currentUser: function() {
      this.getPunchData();
    }
  },
  methods: {
    buildGraph: function() {
      // eslint-disable-next-line
      // console.log("HI")
      let margin = { top: 10, right: 20, bottom: 30, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;
      // eslint-disable-next-line
      let svg = d3
        .select("#punch_card")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    },
    getPunchData: function() {
      this.$octokit.repos
        .listForUser({
          username: this.currentUser
        })
        .then(res => {
          let userRepos = res.data.map(e => e.name);
          let promises = [];
          userRepos.forEach(e => {
            promises.push(
              this.$octokit.repos.getPunchCardStats({
                owner: this.currentUser,
                repo: e
              })
            );
          });
          Promise.all(promises).then(repoStats => {
            this.punchCardData = repoStats.map(e => e.data);
          });
          
        }).catch(err => {
            //eslint-disable-next-line
            console.log(err)
        });
    }
  }
};
</script>

<style>
</style>