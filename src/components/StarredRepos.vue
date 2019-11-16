<template>
  <div class="d-flex card shadow">
      <div class="card-body">
        <div class="d-flex flex-row">
            <h5 class="card-title mt-0">
                Starred Repos
            </h5>
           <a class="ml-auto click-able" href="#"><i class="fa fa-arrows-alt" v-on:click="showMore()"></i></a>
        </div>
      <p class="mb-0" v-for="star in starred.slice(0,4)" v-bind:key=star.id>{{buildName(star)}}
          <a class="mr-auto" target="_blank" v-bind:href="star.url" v-bind:id="'star'+star.id" >
              <i class="fa fa-link"></i>
              </a>  
      </p>

      </div>
    <b-tooltip v-for="star in bigStars" v-bind:key="star.id" v-bind:target="'star'+star.id" triggers="hover focus" delay="{ show: 100, hide: 500}">
            {{star.name}}
    </b-tooltip>
    <b-modal id="all-stars" hide-footer scrollable hide-backdrop content-class="shadow-lg" cancel-disabled>
        <template v-slot:modal-title>
            Starred repos
        </template>
        <div class="d-flex flex-column">
            <p class="mb-0" v-for="star in starred" v-bind:key=star.id>{{star.name}}
                <a class="mr-auto" target="_blank" v-bind:href="star.url" v-bind:id="'star'+star.id" >
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
            starred: null
        }
    },
    created: function() {
        this.getstarred()
    },
    computed: {
        bigStars: function(){
            if(this.starred != null){
            return this.starred.filter(e => e.tooLong)
            }
            return []
        }
    },
    props: {
        userName: null
    },
    watch:{
        userName:function(){
            this.getstarred()
        }
    },
    methods: {
        getstarred: function() {
            this.$octokit.activity.listReposStarredByUser({
                username: this.userName,
                sort:     "updated",
                per_page: 100
            }).then(res => {
                this.starred = res.data.map(e => {
                    let obj = {}
                    obj['name'] = e.full_name
                    obj['id'] = e.id
                    obj['url'] = e.html_url
                    obj['tooLong'] = false
                    return obj
                })
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err)
            })
        },
        buildName: function(star) {
            if(star.name.length > 24) {
                star.tooLong = true
                return star.name.slice(0,24)+"..."
            }
            else return star.name
            
        },
        showMore: function(){
            this.$bvModal.show("all-stars")
        }
    }
}
</script>

<style>
    #click-able{
        cursor: pointer;
        color: black;
    }
</style>