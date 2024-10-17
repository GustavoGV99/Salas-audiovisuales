<script setup>
import { onMounted, ref, defineModel } from 'vue';
import { useCalendarioStore } from "../store/calendario"
import { useLogStore } from "../store/log"
import { useAuthStore } from '../store/auth';

import axios from "axios";

const calendarioStore = useCalendarioStore();
const logStore = useLogStore();
const authStore = useAuthStore();

const salas = ref([]);
const usuarios = ref([]);
const nombre = ref("");
const descripcion = ref("");
const telefono = ref("");
const status = ref("Reservado");
const salaudiovisual = ref("")
const docente = ref("");
const objInsert = ref({});

const fecha = new Date();
const año = fecha.getFullYear();
const mes = fecha.getMonth() + 1;
const dia = fecha.getDate();
const fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;

console.log("Fecha del día de hoy: " + fechaFormateada);
console.log("DATA DE EVENTOS: ", calendarioStore.guardarEvento);
const hInicioIgual = calendarioStore.guardarEvento.some(i => i.horaini_eve === calendarioStore.horaIni);
const hFinIgual = calendarioStore.guardarEvento.some(f => f.horafin_eve === calendarioStore.horaFin);



const formulario = async (fecha_eve, horaini_eve, horafin_eve) => {
  const regexTelefono = /^[0-9]{10}$/;

  try {

    if (!regexTelefono.test(telefono.value)) {
      Swal.fire({ icon: 'error', title: 'Número de telefono', text: 'El número de telefono contiene letras y/o es menor a 10 digitos', timer: 5000, timerProgressBar: true, });
    } else {
      objInsert.value.nomevento_eve = nombre.value;
      objInsert.value.descripcion_eve = descripcion.value;
      objInsert.value.status_eve = status.value;
      objInsert.value.id_sala = salaudiovisual.value;
      objInsert.value.id_usu = docente.value;
      objInsert.value.telefono_eve = telefono.value;
      if (calendarioStore.seleccionarDia >= fechaFormateada) {
        // const { dato } = await axios.post('http://localhost:3000/evento/', { nomevento_eve: nombre.value, descripcion_eve: descripcion.value, telefono_eve: telefono.value, status_eve: status.value, id_sala: salaudiovisual.value, id_usu: docente.value, fecha_eve: calendarioStore.seleccionarDia, horaini_eve: calendarioStore.horaIni, horafin_eve: calendarioStore.horaFin });
       

        const { dato } = await axios({
          method: "POST",
          url: 'http://localhost:3000/evento/',
          data: { nomevento_eve: nombre.value, descripcion_eve: descripcion.value, telefono_eve: telefono.value, status_eve: status.value, id_sala: salaudiovisual.value, id_usu: docente.value, fecha_eve: calendarioStore.seleccionarDia, horaini_eve: calendarioStore.horaIni, horafin_eve: calendarioStore.horaFin},
          headers: {
          Authorization: "Bearer " + authStore.token},
        })
        Swal.fire({ title: '¡Éxito!', text: 'Evento registrado', icon: 'success', button: 'OK' });

        nombre.value = "";
        descripcion.value = "";
        telefono.value = "";
        status.value = "";
        salaudiovisual.value = "";
        docente.value = "";
        logStore.isRegister = true;

      } else {
        Swal.fire({ icon: 'error', title: 'Selección de fecha', text: 'Seleccionaste una fecha anterior al día actual', timer: 5000, timerProgressBar: true, });
      }
    }
  } catch (error) {
    Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Hubo un error al procesar los datos. Por favor, inténtalo de nuevo.',
  });
    logStore.isRegister = false;
  }
}

const getData = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/sala');
    const { data: dataUsu } = await axios.get('http://localhost:3000/usuario');
    salas.value = data.salas;
    usuarios.value = dataUsu.users;
  } catch (error) {
    console.log(error)
  } finally {

  }
};


getData();



</script>
<template>
  <form action class="form" @submit.prevent="formulario">
    <h3 class="mt-3" >Registro de eventos</h3>

    <div class="mb-3">
      <label class="form-label mt-3">Nombre del evento</label>
      <input type="text" class="form-control" v-model="nombre" required>

      <label class="form-label">Descripcion</label>
      <textarea class="form-control" rows="3" v-model="descripcion"></textarea>

      <label class="form-label">Telefono</label>
      <input type="tel" class="form-control" v-model="telefono" required>

      <label class="form-label mt-3">Hora de inicio </label>
      <input type="text" class="form-control" disabled v-model="calendarioStore.horaIni">

      <label class="form-label mt-3">Hora fin </label>
      <input type="text" class="form-control" disabled v-model="calendarioStore.horaFin">

      <label class="form-label mt-3">Fecha </label>
      <input type="text" class="form-control" disabled v-model="calendarioStore.seleccionarDia">

      <label class="form-label mt-3">Seleccione una sala audiovisual</label>
      <select class="form-select" v-model="salaudiovisual" required>
        <option v-for="item in salas" :value="item.id_sal"> {{ item.nombre_sal }} </option>
      </select>

      <label class="form-label mt-3">Selecciona el status de la sala</label>
      <select class="form-select" v-model="status" required>
        <option> Reservado </option>
      </select>


      <label class="form-label mt-3">Docente que ocupara la sala</label>
      <select class="form-select" v-model="docente" required>
        <option v-for="item in usuarios" :value="item.id_usu"> {{ item.nomcompleto_usu }}</option>
      </select>

      <button class="btn btn-primary mt-3" type="submit" @click="">Registrar</button>



    </div>
  </form>
</template>

<style>
h3 {
  color: black;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-align: center; 
  padding-top: 50px;
}

.popupRegistrar {
  border: 1px solid black;
  background-color: aqua;
}

</style>


