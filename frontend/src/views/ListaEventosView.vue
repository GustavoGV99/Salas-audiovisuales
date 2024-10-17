<script setup>
import { useCalendarioStore } from "../store/calendario"
import { useLogStore } from "../store/log"
import { onMounted, watch, ref } from 'vue';
import axios from "axios";
import { useAuthStore } from "../store/auth";
const calendarioStore = useCalendarioStore();
const logStore = useLogStore();
const authStore = useAuthStore();

const eliminarEvento = async (evento) => {
  console.log("id_Evento: ", evento)
  try {
    // const rmEvento = await axios.delete('http://localhost:3000/evento/borrar', { data:  { id_eve: evento } } );


    const rmEvento = await axios({
      method: "DELETE",
      url:'http://localhost:3000/evento/borrar',
      data: {id_eve: evento},
      headers: {
          Authorization: "Bearer " + authStore.token},
    });

    calendarioStore.guardarEvento = calendarioStore.guardarEvento.filter(eve => eve.id_eve !== evento);


    Swal.fire({
      title: '¡Éxito!',
      text: 'Evento eliminado',
      icon: 'success',
      button: 'OK'
    });

  } catch (error) {
    console.log(error);
  }
}


</script>
<template>
  <ul class="list-group">
    <h3 class="mt-3" style="text-align: center; padding-top: 50px; margin-bottom: 60px;">Lista de eventos</h3>
    <p v-if="calendarioStore.guardarEvento == false" class="mt-3" id="mensaje">Seleccione una fecha para mostrar los eventos registrados.</p>
    <li class="list-group-item list-group-item-action list-group-item-success "
      v-for="i in calendarioStore.guardarEvento"> Nombre del evento: {{ i.nomevento_eve }} - Descripcion: {{i.descripcion_eve }} - Fecha: {{ i.fecha_eve.slice(0, 10) }} - Hora de inicio: {{ i.horaini_eve.slice(0, 5) }} Hora de termino: {{ i.horafin_eve.slice(0, 5) }}<br>
      <button v-if="!logStore.isDocente" type="button" class="btn btn-danger" @click="eliminarEvento(i.id_eve)">Eliminar</button>
    </li>
  </ul>
</template>

<style>
h3 {
  color: black;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

#mensaje {
  font-size: 20px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: grey;
  display: flex;
  justify-content: center;
  align-items: center;

}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
