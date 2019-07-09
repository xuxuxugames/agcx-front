<template>
  <section id="about">
    <div class="logo">
      <span class="lead">A</span>
      <span class="lead">G</span>
      <span class="lead">C</span>
      <span class="lead">X</span>
    </div>
    <p>
      AGCX，全称「AirControl Games Collection by
      XuXuXuGames」，是「XuXuXuGames」团队推出的隔空操作游戏系列合集，使用船新的操作方式来唤醒经典游戏在人们心目中的记忆。合集不只包含了「贪吃蛇」、「吃豆人」这种世界经典游戏，还移植了「2048」等目前较为流行的游戏。
    </p>
  </section>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style lang="scss" scope>
#about {
  width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .logo {
    text-align: center;
    margin: 20px auto;
    width: 600px;
    height: 200px;
    border: 5px dashed #91989f;
    border-radius: 5px;

    span {
      margin: 0 30px;
      font-family: "Comic Sans MS";
      font-size: 128px;
    }
  }

  p {
    text-indent: 2em;
  }
}
</style>
