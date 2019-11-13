<template>
  <div class="card ml-1 shadow" id="punch_card_outer" style="width:560px;">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title d-flex justify-content-center">Punch Card</h5>
      <span v-if="loading" class="spinner-border text-primary d-flex justify-self-center align-self-center m-auto" role="status" aria-hidden="true" style="width:5rem;height:5rem"></span>
      <div id="punch_card" class="mt-3 pt-3" v-show="!loading"></div>
    </div>
  </div>
</template>

<script>
const d3 = require("d3");
const daysOfWeek = ["","Mon","Tue","Wed","Thur","Fri","Sat","Sun"]
export default {
  data: function() {
    return {
      punchCardData: null,
      loading: false
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
            .append("text")

        let y = d3.scaleLinear()
            .domain([0,24])
            .range([height, 0])
        svg.append("g")
            .call(d3.axisLeft(y).tickValues([...Array(25).keys()]));

        let z = d3.scaleLinear()
            .domain([0, max])
            .range([0, 20])

        let tooltip = d3.select("#punch_card_outer")
            .append("div")
              .style("opacity", 0)
              .attr("class", "tooltip")
              .style("background-color", "black")
              .style("border-radius", "5px")
              .style("padding", "10px")
              .style("color", "white")
              .style("float", "left")
              .style("position", "absolute")
              .style("z-index", "100")
              .style("white-space", "nowrap")
              .style("display", "block")
              .style("width", "8rem")

        let showTooltip = function(d) {
          tooltip
            .transition()
            .duration(200)
          tooltip
            .style("opacity", 1)
            .html("Commits: " + d[2])
            .style("left", (d3.mouse(this)[0]+30)+"px")
            .style("right", (d3.mouse(this)[1]+30)+"px")
        }
        //eslint-disable-next-line
        let moveTooltip = function(d) {
          tooltip
            .style("left", (d3.mouse(this)[0]+30)+"px")
            .style("top", (d3.mouse(this)[1]+30)+"px")
        }

        //eslint-disable-next-line
        let hideTooltip = function(d) {
          tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
        }

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
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)
        this.loading = false
    },
    getPunchData: function() {
      this.loading = true
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
            this.punchCardData = collateStats(repoStats.map(e => e.data))
          }).then(() => {
                this.buildGraph();
                this.loading = false;
          });
          
        }).catch(err => {
          //eslint-disable-next-line
          console.log(err)
        });
    }
  }
};
function collateStats(stats){
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