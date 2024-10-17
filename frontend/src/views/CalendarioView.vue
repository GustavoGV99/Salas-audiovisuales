<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import { useCalendarioStore } from "../store/calendario"
import { useRouter } from 'vue-router'
import RegistrarEvento from './RegistrarView.vue'
import Listar from './ListaEventosView.vue'
import { useLogStore } from "../store/log";


const objInsert = ref({});
const nombre = ref("");
const usuario = ref("");
const rol = ref("");
const contrasenia = ref("");
const isLogin = ref(true);
const contrasenia2 = ref("");


const formulario = async () => {
  try {
    objInsert.value.nom_usu = usuario.value
    objInsert.value.nomcompleto_usu = nombre.value
    objInsert.value.contrasenia_usu = contrasenia.value
    objInsert.value.rol_usu = rol.value;


    if (contrasenia.value === contrasenia2.value) {
      const { data } = await axios.post('http://localhost:3000/usuario/', { nom_usu: usuario.value, nomcompleto_usu: nombre.value, contrasenia_usu: contrasenia.value, rol_usu: rol.value });


      Swal.fire({
        title: '¡Exito!',
        text: 'Usuario: ' + nombre.value + ' registrado con exito',
        icon: 'success',
        button: 'OK'
      });

      usuario.value = "";
      nombre.value = "";
      contrasenia.value = "";
      contrasenia2.value = "";
      rol.value = "";

    } else {

      Swal.fire({
        icon: 'error',
        title: 'Campos diferentes',
        text: 'La contraseña no coincide',
        timer: 3000,
        timerProgressBar: true,
      });
    }

  } catch (error) {
    console.log(error)
  }
}



const router = useRouter();

const calendarioStore = useCalendarioStore();
const logStore = useLogStore();

const activo = ref(true);

const date = ref(new Date());
const horaIni = ref(new Date());
const horaFin = ref(new Date());

const diasEvento = ref([]);
const fehasEventos = ref([]);

const nombEvento = ref([]);
const nombreEventos = ref([]);

const changeHourIni = () => {
  console.log("Cambio de hora a hora: " + horaIni.value.getHours() + " minutos: " + horaIni.value.getMinutes() + " segundos: " + horaIni.value.getSeconds());
  calendarioStore.horaIni = horaIni.value.getHours() + ":" + horaIni.value.getMinutes() + ":" + horaIni.value.getSeconds();
}

const changeHourFin = () => {
  console.log("Cambio de hora a hora: " + horaFin.value.getHours() + " minutos: " + horaFin.value.getMinutes() + " segundos: " + horaFin.value.getSeconds());
  calendarioStore.horaFin = horaFin.value.getHours() + ":" + horaFin.value.getMinutes() + ":" + horaFin.value.getSeconds();

}

const changeDay = async (day) => {
  console.log("Cambio de dia", day.id);
  try {
    const { data } = await axios.post('http://localhost:3000/evento/dia', { fecha_eve: day.id })
    console.log("Datos de evento: ", data.eventos);
    calendarioStore.guardarEvento = data.eventos
    calendarioStore.seleccionarDia = day.id

  } catch (error) {
    console.log(error);
  }
}

const changeMonth = async (month) => {
  console.log("Cambio de mes: ", month[0].id);
  const fecha = month[0].id + "-01"
  try {
    const { data } = await axios.post('http://localhost:3000/evento/mes', { fecha_eve: fecha });
    console.log("Respuesta ", data.eventos);
    diasEvento.value = data.eventos;
    fehasEventos.value = diasEvento.value.map((evento) => {
      return new Date(evento.fecha_eve);
    })
    console.log(fehasEventos.value, "FECHAS EVENTOS")
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  try {
    const fecha = date.value.getFullYear() + "-" + (date.value.getMonth() + 1 >= 10 ? date.value.getMonth() + 1 : "0" + date.value.getMonth() + 1) + "-01";
    console.log(fecha);
    const { data } = await axios.post('http://localhost:3000/evento/mes', { fecha_eve: fecha });
    console.log("Respuesta de onmunted ", data.eventos);

    diasEvento.value = data.eventos;

    nombEvento.value = data.eventos;

    nombreEventos.value = nombEvento.value.map((evento) => {
      return (evento.nomevento_eve.toString());
    })

    fehasEventos.value = diasEvento.value.map((evento) => {
      return new Date(evento.fecha_eve);
    })

    console.log("Nombre de eventos", nombEvento.value);
    console.log("FECHAS EVENTOS", fehasEventos.value);

  } catch (error) {
    console.log(error);
  }
});

const rules = ref({
  hours: { min: 7, max: 19 },
  minutes: { interval: 5 },
});


const attributes = ref([
  {
    dot: true,
    key: 'today',
    highlight: {
      color: 'blue',
      fillMode: 'light',
      contentClass: 'italic',
    },
    dates: fehasEventos,

  },

]);

const reload = async () => {
  console.log("CALENDARIO RECARGADO");
  try {
    const fecha = date.value.getFullYear() + "-" + (date.value.getMonth() + 1 >= 10 ? date.value.getMonth() + 1 : "0" + date.value.getMonth() + 1) + "-01";
    console.log(fecha);
    const { data } = await axios.post('http://localhost:3000/evento/mes', { fecha_eve: fecha });
    console.log("Respuesta de onmunted ", data.eventos);

    diasEvento.value = data.eventos;

    nombEvento.value = data.eventos;

    nombreEventos.value = nombEvento.value.map((evento) => {
      return (evento.nomevento_eve.toString());
    })

    fehasEventos.value = diasEvento.value.map((evento) => {
      return new Date(evento.fecha_eve);
    })

  } catch (error) {
    console.log("Error en reload: ", error);
  }

};


</script>

<template>
  <div class="container">
    <div class="row w-100">
      <div class="col-6">
        <!-- <p>{{ logStore.nomUser }}</p> -->
        <div>
          <div>
            <main>
              <h3 class="mt-3">Calendario de eventos</h3>
              <div class="btn-p">
                <button class="checkbtn" @click="reload()"> Recargar calendario
                </button>
              </div>

              <VCalendar class="mt-3" ref="calendary" v-model="date" expanded @dayclick="changeDay"
                @did-move="changeMonth" :attributes="attributes">
                <template #footer>
                  <div class="hours">
                    <div class="hour-item">
                      <label>Hora de inicio</label><br>
                      <VDatePicker v-model="horaIni" hide-time-header mode="time" @update:modelValue="changeHourIni"
                        :rules="rules" />
                    </div>
                    <div class="hour-item">
                      <label>Hora fin</label><br>
                      <VDatePicker v-model="horaFin" hide-time-header mode="time" @update:modelValue="changeHourFin"
                        :rules="rules" />
                    </div>
                  </div>
                </template>
              </VCalendar>
            </main>
          </div>
        </div>
        <nav>
          <a class="nav-link" @click="activo = false">Lista de eventos</a>
          <a class="nav-link" @click="activo = true">Registro de eventos</a>
          <a v-if="!logStore.isDocente" class="nav-link" href="#" data-bs-toggle="modal"
            data-bs-target="#registrarUsu">Registrar usuario</a>
          <!-- <a @click="logStore.cerrarSesion()" v-if="logStore.isLogin" >Cerrar Sesion</a> -->

        </nav>
      </div>
      <div class="col-6 text-center">
        <RegistrarEvento v-if="activo" />
        <Listar v-else />
      </div>
    </div>

  </div>


  <div class="modal fade" id="registrarUsu" tabindex="-1" aria-label="registrarModeloLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="registrarModeloLabel"
            style="text-align: center; font-size: 20px; text-transform: uppercase; "> Registro de Docente y/o
            Administrador </h3>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form action class="form" @submit.prevent="formulario">
            <label class="form-label mt-3">Nombre de la persona </label>
            <input type="text" class="form-control" v-model="nombre" required>

            <label class="form-label mt-3">Nombre de usuario</label>
            <input type="text" class="form-control" v-model="usuario" required>

            <label class="form-label mt-3">Rol</label>
            <select class="form-select" v-model="rol" required>
              <option value="Docente">Docente</option>
              <option value="Administrador">Administrador</option>
            </select>

            <label class="form-label mt-3" for="password">Contraseña</label>
            <input type="password" class="form-control" v-model="contrasenia" required>

            <label class="form-label" for="confirmPassword">Confirmar contraseña</label>
            <input type="password" class="form-control" v-model="contrasenia2" required>

            <button class="btn btn-primary mt-3" type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-p {
  display: flex;
  justify-content: left;
  width: 200px;
}


.btn-p button {
  padding: 5px;
  color: #000;
  background: #fff;
  transition: .5s;
  border: 1px solid rgba(15, 11, 11, .18);
}

.btn-p button:hover {
  transition: .5s;
  background: #BFDBFE;
  color: #1E3A8A;
}



.hours {
  display: flex;
  justify-content: space-around;
}

.hour-item {
  position: relative;
}

.hour-item>label {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
}

h3 {
  padding-top: 50px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: black;
  text-align: center;
}


nav {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}



nav a {
  padding: 5px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  width: 200px;
  transition: .5s;
  margin: 1px;
  border: 1px solid rgba(15, 11, 11, .18);
  font-size: 15px;
}

nav a:hover {
  background: #BFDBFE;
  color: #1E3A8A;
  transition: .5s;


}

.modal fade:hover{
  transition: 1s;
}

@media only screen and (max-width: 875px) {
  .container {
    flex-direction: column;
  }

  .col-6 {
    width: 100%;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 25px;
  }

  .nav-link {
    display: block;
    text-align: center;
    margin-bottom: 10px;
  }

  .text-center {
    text-align: center;
  }

  .hour-item {
    margin-bottom: 10px;
  }
}</style>