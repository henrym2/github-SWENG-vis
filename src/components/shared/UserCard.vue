<template>
  <div class="d-flex card shadow" style="width: 20rem;" id="user_card">
      <img v-bind:src="userData.avatar_url" alt="https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png" class="card-img-top img-fluid">
      <div class="card-body">
        <h5 class="card-title">{{userData.name}}</h5>
        <p class="card-text mb-0">Followers: {{userData.followers}}</p>
        <p v-if="isOrg" class="card-text mb-0">Following: {{userData.following}}</p>
        <p v-if="userData.collaborators">Collaborators: {{userData.collaborators}}</p>
        <p v-if="userData.company" class="card-text mb-0">Company: {{userData.company}}</p>
        <p class="card-text mb-0">Bio: {{userData.bio ? userData.bio : userData.blog}}</p>
      </div>
  </div>
</template>

<script>
export default {
  data: function() {
      return{
      }
  },
  props:{
          userData: Object,
          isOrg: Boolean
  },
  methods: {
  
  },
  
}
</script>

<style>

</style>