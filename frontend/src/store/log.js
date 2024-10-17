import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from './auth';


export const useLogStore = defineStore('login', () => {
    state: () => ({
        loadingUser: false,
    })

    let isLogin = ref(false);
    const router = useRouter();
    let isRegister = ref(false);
    let isAdministrador = ref(false);
    let isDocente = ref(false);
    let nomUser = ref("");
    const useAuth = useAuthStore();
    
    const iniciarSesion = async (usuario) => {
        
        try {
            const { data } = await axios({
                method: "POST",
                url: 'http://localhost:3000/login',
                data: usuario,
                withCredentials: true,
            });

            console.log(data);
            useAuth.token = data.token || null;
            useAuth.expiresIn = data.expiresIn || null;

            if (useAuth.token) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Inicio de sesion correcto',
                    icon: 'success',
                    button: 'OK'
                });
                localStorage.setItem("isLogin", true);
                router.push("/calendario");
            } else {
                console.log("Error en login");
            }
            console.log(useAuth.token, useAuth.expiresIn);
            isLogin.value = true;
           

            if (data.user.rol_usu === 'Administrador') {
                isAdministrador.value = true;
                isDocente.value = false;
                console.log("Es administrador");
            } else {
                isDocente.value = true;
                isAdministrador.value = false;
                console.log("Es docente");
            }

        } catch (error) {
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Contraseña y/o Usuario incorrecto',
                timer: 3000, // Tiempo en milisegundos
                timerProgressBar: true,
            });
        } finally {

        }
    }

    const cerrarSesion =  async () => {
       await useAuth.func_logout();
        isLogin.value = false;
    }

    return {
        isLogin,
        iniciarSesion,
        cerrarSesion,
        isRegister,
        isAdministrador,
        isDocente,
        nomUser

    }
});

