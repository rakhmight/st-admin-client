<template>
    <div class="content">
        <subtitle-component :subtitle="'Exam monitoring and management'" />

        <exams-table />
    </div>
</template>

<script>
import SubtitleComponent from '@/components/SubtitleComponent';
import ExamsTable from '@/components/panel/ExamsManagement/ExamsTable';

export default {
    components:{
        SubtitleComponent,
        ExamsTable
    }
}
</script>