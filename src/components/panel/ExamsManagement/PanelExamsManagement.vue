<template>
    <div class="wrapper">
        <title-component :title="'Exams management'" />

        <div>
            <v-tabs
            v-model="tab"
            density="compact"
            color="var(--main-color)"
            >
                <v-tab value="monitoring" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Monitoring</span></v-tab>
                <v-tab value="new" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">New exam</span></v-tab>


                <v-tab value="exam" style="border-bottom: 1px solid #ccc" v-if="showExamPanel"><span class="text-subtitle-2 lim-txt" style="max-width: 400px">Exam panel: {{ getSubjectName() }}</span></v-tab>
            </v-tabs>

            <v-window v-model="tab" class="mt-5">
                <v-window-item value="monitoring">
                    <monitoring-exams
                    :changeTab="changeTab"
                    :updateExam="updateExam"
                    />
                </v-window-item>
                <v-window-item value="new">
                    <new-exam />
                </v-window-item>
                <v-window-item value="exam">
                    <exam-monitoring :updateExam="updateExam" :changeTab="changeTab" />
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import MonitoringExams from '@/components/panel/ExamsManagement/MonitoringExams';
import NewExam from '@/components/panel/ExamsManagement/NewExam';
import ExamMonitoring from './ExamMonitoring.vue';
import { mapGetters, mapMutations } from 'vuex';
import { getSubject } from '@/plugins/getInfo'
import makeReq from '@/services/makeReq'

export default {
    data(){
        return {
            tab: 'monitoring',
            showExamPanel: false
        }
    },
    computed: mapGetters(['getCurrentExam', 'getSubjects', 'getAuthParams', 'getAdminServerIP']),
    components:{
        TitleComponent,
        MonitoringExams,
        NewExam,
        ExamMonitoring
    },
    methods: {
        ...mapMutations(['updateExamState', 'updateCurrentExamState']),

        getSubjectName(){
            if(this.getCurrentExam.complex.length == 1) {
                return getSubject(this.getCurrentExam.complex[0].subject, this.getSubjects)
            } else return 'Complex exam'
        },

        changeTab(tab){
            this.tab = tab
        },

        checkCurrentExam(){
            if(this.getCurrentExam) this.showExamPanel = true
            else this.showExamPanel = false
        },

        async updateExam(exam, type){
            if(!exam.hasBegun && exam.examDateParams.start.byCommand || exam.hasBegun && exam.examDateParams.end.byCommand){
                const data = await makeReq(`${this.getAdminServerIP}/api/exams/updatestate`, "POST", {
                    auth: {
                        ...this.getAuthParams
                    },
                    data:{
                        type,
                        examID: exam.id
                    }
                })
                .catch(error => console.error(error))

                if(data && data.statusCode==200){
                    this.updateExamState({type, examID: exam.id})
                    this.updateCurrentExamState({ type })
                    return data
                }
            }
        },
        
    },
    watch:{
        getCurrentExam(){
            this.checkCurrentExam()
        }
    },
    mounted(){
        this.checkCurrentExam()
    }
}
</script>