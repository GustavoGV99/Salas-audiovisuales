import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useLogStore } from '../store/log'
import { useAuthStore } from "../store/auth";
import axios from 'axios';



const requireAuth = async (to, from, next) => {
  const storeLog = useLogStore();

  console.log("Entra en requiere",)
  const useAuth = useAuthStore();
  await useAuth.validateSession();
  console.log("IMPRESION DE USEATH TOKEN: ", useAuth.token);
  
  if (useAuth.token) {
    storeLog.isLogin = true;

    const { data } = await axios.post('http://localhost:3000/usuario/iduser',{token: useAuth.token})

    if (data.user.rol_usu === 'Administrador') {
      storeLog.isAdministrador = true;
      storeLog.isDocente = false;
      console.log("Es administrador");
    } else {
      storeLog.isDocente = true;
      storeLog.isAdministrador = false;
      console.log("Es docente");
    }
    return next();
  }
  return next("/");
};



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      props: true
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: () => import('../views/CalendarioView.vue'),
      props: true,
      beforeEnter: requireAuth
    },
    {

    }
  ]
})

export default router


