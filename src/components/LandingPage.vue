<template>
  <div id="overlay" class="overlay">
    <div class="overlay-content">
      <p class="gradientText">GitVis</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  props: {
    msg: String
  }
}
</script>

<style>
.overlay {
  position: fixed; /* Sit on top of the page content */
  display: block; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black; /* Black background with opacity */
  z-index: 1; /* Specify a stack order in case you're using a different order for other elements */
}
.overlay-content{
  position: absolute;
  top: 45%;
  left: 50%;
  font-size: 10rem;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
}

.gradientText{
  color: transparent;
  transition-duration: 0.3s;
  background: linear-gradient(to right, #13f3b9 0%, rgb(48, 88, 250) 50%, transparent 50%) 100% 0 / 200% 200% #474E51;
  background-clip: text;
  text-shadow: whitesmoke;
  cursor: default;
}

.gradientText:hover {
  background-position: 0 0;
}

</style>
