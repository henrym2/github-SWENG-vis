<template>
  <div class="card ml-1 shadow">
    <div class="card-body">
      <h5 class="card-title">Punch Card</h5>
      <div id="punch_card" class="mt-3 pt-3"></div>
    </div>
  </div>
</template>

<script>
const d3 = require("d3");
const daysOfWeek = ["","Mon","Tue","Wed","Thur","Fri","Sat","Sun"]
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
      let graph = d3.select("#punch-graph")
      if(graph) {
        graph.remove()
      }
      let margin = { top: 15, right: 20, bottom: 30, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;
      // eslint-disable-next-line
      let svg = d3
        .select("#punch_card")
        .insert("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "punch-graph")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        let punchCardData = this.punchCardData
        let max = 0
        punchCardData.forEach(stat => {
          if(Math.max(...stat) > max){
            max = Math.max(...stat)
          }
        })
        let x = d3.scaleLinear()
            .domain([0 ,7])
            .range([0, width])
            
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickValues([0,1,2,3,4,5,6,7])
            .tickFormat(function(d,i){return daysOfWeek[i]}))
            
        let y = d3.scaleLinear()
            .domain([0,24])
            .range([height, 0])
        svg.append("g")
            .call(d3.axisLeft(y));

        let z = d3.scaleLinear()
            .domain([0, max])
            .range([0, 20])
            
        svg.append("g")
           .selectAll("dot")
           .data(punchCardData)
           .enter()
           .append("circle")
                .attr("cx", function(d){ return x(d[0]+1)})
                .attr("cy", function(d){ return y(d[1]+1)})
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
            //TODO, SUM ALL DAYS, SUM ALL HOURS, SUM ALL REPOS
            //eslint-disable-next-line
            this.punchCardData = collateStats(repoStats.map(e => e.data))
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
function collateStats(stats){
  //eslint-disable-next-line
  // console.log(stats)
  let arr = []

  let k = 0
  for(let i = 0; i < 24*7; i++){
    if(i % 24 == 0 && i != 0){
      k++
    } 
    arr.push([(k),(i%24),0])
  }

  stats.forEach(repo => {
    let j = 0;
    repo.forEach(stat => {
      if(arr[j][0] == stat[0] && arr[j][1] == stat[1]){
        arr[j][2] += stat[2]
      }
      j++;
    })
  })
  //eslint-disable-next-line
  return arr  
}
/*   0   1   2          0 1 2 
  0 [0] [2] [0]         1
  1 [0] [5] [2]         2 
  2 [0] [5] [5]         3 
  3 [1] [2] [11]        .
                     24*7   
*/
</script>

<style>
</style>