<template>
    <div class="content">
        <subtitle-component :subtitle="'Exam monitoring and management'" />

        <div v-if="!getExamsGetting">
            <exams-table
            :changeTab="changeTab"
            :updateExam="updateExam"
            />

            <data-empty :text="'Exams not found'" v-if="!getExams.length" />
        </div>

        <div class="d-flex justify-center align-center" style="height: 300px" v-else>
            <div class="d-flex flex-column align-center" style="gap: 10px">

                <v-progress-circular
                :rotate="360"
                :size="50"
                :width="3"
                :model-value="loading"
                color="var(--main-color)"
                >
                </v-progress-circular>
                
                <p style="font-size: 0.9rem; color: #555">Loading data. Wait..</p>

            </div>
        </div>
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SubtitleComponent from '@/components/SubtitleComponent';
import ExamsTable from '@/components/panel/ExamsManagement/ExamsTable';
import DataEmpty from '@/components/DataEmpty.vue'

export default {
    props:{
        changeTab: Function,
        updateExam: Function
    },
    data(){
        return {
            interval: {},
            loading: 0
        }
    },
    components:{
        SubtitleComponent,
        ExamsTable,
        DataEmpty
    },
    watch: {
        getExamsGetting(){
            if(!this.getExamsGetting){
                clearInterval(this.interval)  
            }
        }
    },
    beforeUnmount () {
      clearInterval(this.interval)
    },
    mounted () {
      this.interval = setInterval(() => {
        if (this.loading === 100) {
          return (this.loading = 0)
        }
        this.loading += 10
      }, 1000)
    },
    computed: mapGetters(['getExams', 'getExamsGetting'])
}
</script>