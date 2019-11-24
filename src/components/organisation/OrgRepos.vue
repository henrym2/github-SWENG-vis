<template>
  <div class="d-flex card shadow">
      <div class="card-body">
        <div class="d-flex flex-row">
            <h5 class="card-title mt-0">
                Organisation Repos
            </h5>
           <a class="ml-auto click-able" href="#"><i class="fa fa-arrows-alt" v-on:click="showMore()"></i></a>
        </div>
      <p class="mb-0" v-for="repo in repos.slice(0,5)" v-bind:key=repo.id>{{buildName(repo)}}
          <a class="mr-auto" target="_blank" v-bind:href="repo.url" v-bind:id="'star'+repo.id" >
              <i class="fa fa-link"></i>
              </a>  
      </p>

      </div>
    <b-tooltip v-for="repo in bigRepos" v-bind:key="repo.id" v-bind:target="'star'+repo.id" triggers="hover focus" delay="{ show: 100, hide: 500}">
            {{repo.name}}
    </b-tooltip>
    <b-modal id="all-repos" hide-footer scrollable hide-backdrop content-class="shadow-lg" cancel-disabled>
        <template v-slot:modal-title>
            Organisation Repos
        </template>
        <div class="d-flex flex-column">
            <p class="mb-0" v-for="repo in repos" v-bind:key=repo.id>{{repo.name}}
                <a class="mr-auto" target="_blank" v-bind:href="repo.url" v-bind:id="'star'+repo.id" >
                    <i class="fa fa-link"></i>
                </a>  
            </p>
        </div>
    </b-modal>
  </div>
</template>

<script>
export default {
    data: function() {
        return {
            repos: []
        }
    },
    created: function() {
        this.getRepos()
    },
    computed: {
        bigRepos: function(){
            if(this.repos != []){
            return this.repos.filter(e => e.tooLong)
            }
            return []
        }
    },
    props: {
        orgName: null
    },
    watch:{
        orgName:function(){
            this.getRepos()
        }
    },
    methods: {
        getRepos: function() {
            this.$octokit.repos.listForOrg({
                org: this.orgName,
                sort: "updated",
                type: "public",
                per_page: 100
            }).then(res => {
                //eslint-disable-next-line
                let i = 0
                this.repos = res.data.map(r => {
                    let obj = {}
                    obj["id"] = i
                    obj["name"] = r.name
                    obj["url"] = r.html_url
                    obj["tooLong"] = false
                    i++
                    return obj
                })
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err)
            })
        },
        showMore: function(){
            this.$bvModal.show("all-repos")
        },
        buildName: function(repo) {
          if(repo.name.length > 24) {
              repo.tooLong = true
              return repo.name.slice(0,24)+"..."
          }
          else return repo.name
            
        },
    }
}
</script>

<style>
    #click-able{
        cursor: pointer;
        color: black;
    }
</style>