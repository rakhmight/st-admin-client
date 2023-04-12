<template>
    <div class="content">
        <subtitle-component :subtitle="'Summary reports of completed exams'" />
    </div>
</template>

<script>
import SubtitleComponent from '@/components/SubtitleComponent';

export default {
    components:{
        SubtitleComponent,
    }
}
</script>