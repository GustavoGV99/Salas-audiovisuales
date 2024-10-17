import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { useRouter } from 'vue-router'
// import { basePath,developer } from './c'


export const useAuthStore = defineStore('auth', () => {
    let token = ref(null);
    let expiresIn = ref(null);
    const router = useRouter();


    const func_logout = async () => {
        try {
            await axios.get('http://localhost:3000/login/logout', { withCredentials: true })
            token.value = ""
            expiresIn.value = "";
            localStorage.removeItem("isLogin");
            router.push("/")
        } catch (error) {
            console.log(error);
        }
    }

    const getSession = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: 'http://localhost:3000/login/session',
                withCredentials: true
            });
            console.log("RESPUESTA SESION:", response);
            token.value = response.data.token || null;
            expiresIn.value = response.data.expiresIn || null;
        } catch (error) {
            console.log(error)
        }
    }
    getSession();

    const validateSession = async () => {
        const isLogin = localStorage.getItem("isLogin");
        if (isLogin) {
            if (!token.value) await getSession();
        } else {
            console.log("No esta logeado")
        }
    }

    // const repassword = async (old_password, new_password, token) => {
    //     const url = developer ? ${ basePath }/admin/repassword : /admin/repassword;
    //     const respone = await axios({
    //         method: 'PATCH',
    //         url,
    //         headers: {
    //             Authorization: "Bearer " + token
    //         },
    //         data: {
    //             old_password,
    //             new_password
    //         }
    //     })
    //     return respone;
    // }
    return { token, expiresIn, func_logout, validateSession,  }
})