<template>
  <div class="card shadow d-flex">
      <h5 class="m-3 card-title">
              Language Stats
          </h5>
      <div class="card-body m-auto">
          <span v-if="loading" class="spinner-border text-primary d-flex justify-self-center align-self-center m-auto" role="status" aria-hidden="true" style="width:5rem;height:5rem"></span>
          <div id="language_stats_graph" v-show="!loading"></div>
      </div>
  </div>
</template>

<script>
const d3 = require("d3")
export default {
    name: "LanguageCard",
    data: function(){
        return {
            languageStats: null,
            loading: false
        }
    },
    props: {
        userName: String 
    },
    watch: {
        userName: function() {
            this.getLanguageStats()
        }
    },
    created: function() {
        this.getLanguageStats()
    },
    methods: {
        getLanguageStats() {
            this.loading = true
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
                    this.languageStats = Object()
                    repoStats.map(e =>    
                            e.data
                    ).filter(e => 
                        Object.keys(e).length
                    ).forEach(e => {
                        for(let key of Object.keys(e)){
                            if(key in this.languageStats){
                                this.languageStats[key] += e[key]
                            }else{
                                this.languageStats[key] = e[key]
                            }
                        }
                    })
                    
                    this.languageStats = sortObject(this.languageStats)
                    //eslint-disable-next-line
                    console.log(this.languageStats)
                    this.createGraph()
                    this.loading = false
                })
            })
        },
        createGraph() {
            let pieGraph = d3.select("#pie-graph")
            if(pieGraph){
                pieGraph.remove()
            }
            let width = 500
            let height = 450
            let margin = 65

            let radius = Math.min(width, height) / 2 - margin
            let svg = d3.select("#language_stats_graph")
                        .append("svg")
                          .attr("width", width)
                          .attr("height", height)
                        .attr("id", "pie-graph")
                        .append("g")
                          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            let data = this.languageStats

            let color = d3.scaleOrdinal()
                .domain(data)
                .range(d3.schemeDark2)
            
            let pie = d3.pie()
                        .sort(null)
                        .value(function(d) {return d.value;})
            let data_ready = pie(d3.entries(data))

            let arc = d3.arc()
                        .innerRadius(radius * 0.5)         // This is the size of the donut hole
                        .outerRadius(radius * 0.8)
            
            svg
                .selectAll('allSlices')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', function(d){ return(color(d.data.key)) })
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 0.7)
            //eslint-disable-next-line
            console.log()
            svg.selectAll("mydots")
                .data(Object.keys(data))
                .enter()
                .append("circle")
                .attr("cx", function(d,i){return -200 + i*100})
                .attr("cy", 175)
                .attr("r", 7)
                .style("fill", function(d){return color(d)})

            svg.selectAll("mylabels")
               .data(Object.keys(data))
               .enter()
               .append("text")
               .attr("x", function(d,i){return -190 + i*100})
               .attr("y", 175)
               .style("fill", function(d){return color(d)})
               .text(function(d){return d})
               .attr("text-anchor", "left")
               .style("alignment-baseline", "left")    
        }
    }
}
function sortObject(obj) {
  return Object.keys(obj)
    .sort().slice(0,5).reduce((a, v) => {
    a[v] = obj[v];
    return a; }, {});
}
</script>

<style>

</style>