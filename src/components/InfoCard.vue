<template>
  <div class="d-flex card shadow">
      <div class="card-body">
          <h5 class="card-title">About this project</h5>
          <h6>User Overview</h6>
          <p class="card-text">This site was created as part of the Trinity College Software Engineering module in 3rd year computer science. 
              The project makes use of a number of technologies to visualize various statistics associated with github members, most notably their
              "Punch card stats" and "Language stats". Basic user information is displayed in the first card, including followers, avatar and bio. Along 
              with the users 5 most recent starred repositories. It's easy to infer a users interests from their starred repos. Clicking on the expand button
              will display a list of all of a users starred repos in a Modal. Any user can be searched against using the "search" feild and their username/login name. 
          </p>
          <h6>Punch Card</h6>
          <p class="card-text">
              The Punch Card stats card allows us to see a rough depiction of when a user is most productive, showing us an aggregate of their commits over
              the past number of years but painted onto a single week. We can see down to the hour resolution of when the most or least commits are made
              on a given day and also see which days have the most consistent commits. This can help show us a general overview of their individual productivity.
          </p>
          <h6>Score Card</h6>
          <p class="card-text">
              Another set of useful statistics is the Score Card. This card shows us the high level overview of a users contributions to github and usage of the platform.
              Although altogether simple, this lets us see how a user uses the platform by giving numerical metrics on the number of repos, stars, followers and gists that
              they have publically on the github platform.
          </p>
          <h6>Language Stats</h6>
          <p class="card-text">
              Finally is the Language Stats. This (excluding markup languages like HTML) shows a users most used languages across their public repositories. This is kept specifically
              rough and low resolution, showing only the top 5 languages used. A graph like this helps to show the technologies either most explored or, most comfortable to the given user.
              As technologies have grown incredibly quickly in the past number of years, this is at a glance an easy way to see how proactive a user has been in adopting or
              making use of these in their public projects. 
          </p>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>