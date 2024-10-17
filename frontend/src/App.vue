<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Calendario from './views/CalendarioView.vue'
import { useLogStore } from './store/log'
import Login from './views/LoginView.vue'
import Header from './views/HeaderView.vue'

const logStore = useLogStore();

import { ref } from 'vue';
import axios from 'axios';

const objInsert = ref({});
const nombre = ref("");
const usuario = ref("");
const rol = ref("");
const contrasenia = ref("");
const isLogin = ref(true);



const formulario = async () => {
  try {
    objInsert.value.nom_usu = usuario.value
    objInsert.value.nomcompleto_usu = nombre.value
    objInsert.value.contrasenia_usu = contrasenia.value
    objInsert.value.rol_usu = rol.value;

    const { data } = await axios.post('http://localhost:3000/usuario/', { nom_usu: usuario.value, nomcompleto_usu: nombre.value, contrasenia_usu: contrasenia.value, rol_usu: rol.value });

    usuario.value = "";
    nombre.value = "";
    contrasenia.value = "";
    rol.value = "";

    location.reload();
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <Header></Header>

  <RouterView />

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);

}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;

  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}


</style>
