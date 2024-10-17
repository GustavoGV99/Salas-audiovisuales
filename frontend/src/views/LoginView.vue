<script setup>
import { useRouter } from 'vue-router'
import { useLogStore } from '../store/log';
import { ref } from 'vue';

const logStore = useLogStore();
const router = useRouter();
const vista = true;

const usuario = ref('');
const password = ref('');
const rol = ref('Administrador');

const handlerSubmit = () => {
    const respuesta = logStore.iniciarSesion({
        nom_usu: usuario.value,
        contrasenia_usu: password.value,
        rol_usu: rol.value
    }
    );
}
</script>


<template>
    <div id="contenedor">
        <form @submit.prevent="handlerSubmit">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Nombre de usuario</label>
                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                    v-model="usuario" required>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="exampleInputPassword1" v-model="password" required>
            </div>

            <label class="form-label mt-3">Rol</label>
            <select class="form-select" v-model="rol" required>
                <option value="Docente">Docente</option>
                <option value="Administrador">Administrador</option>
            </select>
            <br>
            <button type="submit" class="btn btn-primary">Iniciar sesion</button>

        </form>
    </div>

    <img src="../img/Petirrojos.png" alt="">
</template>

<style>
#contenedor {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

}

#contenedor form {

    height: auto;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: center;

}

#contenedor form input {
    width: 500px;
}

#contenedor form select {
    width: 500px;
}

#contenedor form button {
    margin-top: 20px;
    width: 500px;
}


img{
    display: none;
}

@media only screen and (max-width: 875px) {

    #contenedor {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    #contenedor form {

        height: auto;
        font-size: 18px;
        display: flex;
        flex-direction: column;
        padding: 20px;
        justify-content: center;

    }

    #contenedor form input {
        width: 300px;
    }

    #contenedor form select {
        width: 300px;
    }

    #contenedor form button {
        margin-top: 20px;
        width: 300px;
        position: absolute;
        bottom: 50px;

    }


}
</style>