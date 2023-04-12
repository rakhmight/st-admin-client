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
            </v-tabs>

            <v-window v-model="tab" class="mt-5">
                <v-window-item value="monitoring">
                    <monitoring-exams />
                </v-window-item>
                <v-window-item value="new">
                    <new-exam />
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import MonitoringExams from '@/components/panel/ExamsManagement/MonitoringExams';
import NewExam from '@/components/panel/ExamsManagement/NewExam';

export default {
    data(){
        return {
            tab: 'monitoring'
        }
    },
    components:{
        TitleComponent,
        MonitoringExams,
        NewExam
    }
}
</script>