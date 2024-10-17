<script setup>
import { useLogStore } from '../store/log'

const logStore = useLogStore();


</script>

<template>
  <div class="head">
    <img src="../img/header.png" alt="">
    <img src="../img/fondo.png" class="img1">
    <!-- <img src="../img/Edu.png" class="img2"> -->
  </div>
  <a @click="logStore.cerrarSesion()" v-if="logStore.isLogin">Cerrar Sesion</a>

</template>
<style scoped>

a{
  position: fixed;
  top: 0;
  right: 0px;
  margin: 5px 5px;
  cursor: pointer;
  padding: 6px;
  text-transform: uppercase;
  transition: .5s;
  border-radius: 5px;
  
}

a:hover{

  background: #BFDBFE;
  color: #1E3A8A !important;
  transition: .5s;
}

img{
  margin: auto;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 50%;
}

.img1{
  display: none;
}


@media only screen and (max-width: 875px) {
  .img1{
    margin: auto;
    display: flex;
    justify-content: center;
    width: 90%;
    margin: 10px;
  }

  img{
    display: none;
  }

  a{
  position: absolute;
  
}

a:hover{

  background: #BFDBFE;
  color: #1E3A8A !important;
  transition: .5s;
}

}
</style>