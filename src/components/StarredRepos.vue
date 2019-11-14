<template>
  <div class="d-flex card shadow">
      <div class="card-body">
      <h5 class="card-title mt-0">
          Starred Repos
      </h5>
      <p class="mb-0" v-for="star in starred" v-bind:key=star.id>{{buildName(star)}}
          <a class="mr-auto" target="_blank" v-bind:href="star.url" v-bind:id="'star'+star.id" >
              <i class="fa fa-link"></i>
        </a>
        
      </p>

      </div>
    <b-tooltip v-for="star in bigStars" v-bind:key="star.id" v-bind:target="'star'+star.id" triggers="hover focus" delay="{ show: 100, hide: 500}">
            {{star.name}}
    </b-tooltip>
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
                per_page: 4
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
            
        }
    }
}
</script>

<style>

</style>