<template>
  <div class="card shadow d-flex">
      <h5 class="m-3 card-title">
              Language Stats
          </h5>
      <div class="card-body m-auto">
          <span v-if="loading" class="spinner-border text-primary d-flex justify-self-center align-self-center m-auto" role="status" aria-hidden="true" style="width:5rem;height:5rem"></span>
          <div id="language_stats_graph" class="m-auto" v-show="!loading"></div>
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
            let width = 450
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
            
            let outerArc = d3.arc()
                             .innerRadius(radius * 0.9)
                             .outerRadius(radius * 0.9)
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

            svg
                .selectAll('allPolylines')
                .data(data_ready)
                .enter()
                .append('polyline')
                  .attr("stroke", "black")
                  .style("fill", "none")
                  .attr("stroke-width", 1)
                  .attr('points', function(d) {
                    var posA = arc.centroid(d) // line insertion in the slice
                    var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                    var posC = outerArc.centroid(d); // Label position = almost the same as posB
                    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                    posC[0] = radius * 0.90 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                    return [posA, posB, posC]
                  })
            
            svg
                .selectAll('allLabels')
                .data(data_ready)
                .enter()
                .append('text')
                  .text( function(d) { 
                      //eslint-disable-next-line
                      /*console.log(d.data.key)*/ ; return d.data.key } )
                  .attr('transform', function(d) {
                      var pos = outerArc.centroid(d);
                      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                      return 'translate(' + pos + ')';
                  })
                  .style('text-anchor', function(d) {
                      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                      return (midangle < Math.PI ? 'start' : 'end')
                  })

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