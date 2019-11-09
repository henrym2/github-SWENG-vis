<template>
  <div class="d-flex card shadow">
      <div class="card-body">
      <h5 class="card-title mt-0">
          Starred Repos
      </h5>
      <p class="mb-0" v-for="star in starred" v-bind:key=star.id>{{star.name}}
          <a class="mr-auto" target="_blank" v-bind:href="star.url">
              <i class="fa fa-link"></i>
        </a>
      </p>

      </div>

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
                    return obj
                })
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err)
            })
        }
    }
}
</script>

<style>

</style>