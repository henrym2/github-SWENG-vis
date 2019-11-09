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
  created: function() {
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
    
        let x = d3.scaleLinear()
            .domain([0 ,7])
            .range([0, width])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
        
        let y = d3.scaleLinear()
            .domain([0,24])
            .range([height, 0])
        svg.append("g")
            .call(d3.axisLeft(y));

        let z = d3.scaleLinear()
            .domain([0, 10000])
            .range([0, 1000])
        svg.append("g")
           .selectAll("dot")
           .data(this.punchCardData)
           .enter()
           .append("circle")
                .attr("cx", function(d){ return x(d[0])})
                .attr("cy", function(d){ return y(d[1])})
                .attr("r", function(d){ return z(d[2])})
                .style("fill", "#69b3a2")
                .style("opacity", "0.7")
                .attr("stroke", "black")
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
            //TODO, SUM ALL DAYS, SUM ALL HOURS, SUM ALL REPOS
            //eslint-disable-next-line
            console.log(this.punchCardData)
          }).then(() => {
                this.buildGraph();
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