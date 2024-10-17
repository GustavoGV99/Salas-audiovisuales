import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
export const useCalendarioStore = defineStore("calendario", () => {

    const date = ref(new Date())
    const guardarEvento = ref([])

    const horaIni = ref(null);
    const horaFin = ref(null);
    const seleccionarDia = ref(null);




   
    return {
        date,
        guardarEvento,
        horaIni,
        horaFin,
        seleccionarDia,

    }
})

 // watch(date, () => {
    //     console.log("OTRO CAMBIO")
    // },{deep:true})