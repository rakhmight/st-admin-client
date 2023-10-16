<template>
    <div class="content">
        <subtitle-component :subtitle="'Exam monitoring and management'" />

        <exams-table :changeTab="changeTab" />
        
        <data-empty :text="'Exams not found'" v-if="!getExams.length" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SubtitleComponent from '@/components/SubtitleComponent';
import ExamsTable from '@/components/panel/ExamsManagement/ExamsTable';
import DataEmpty from '@/components/DataEmpty.vue'

export default {
    props:{
        changeTab: Function
    },
    components:{
        SubtitleComponent,
        ExamsTable,
        DataEmpty
    },
    computed: mapGetters(['getExams'])
}
</script>