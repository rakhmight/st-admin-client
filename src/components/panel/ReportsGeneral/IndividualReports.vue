<template>
    <div class="content">
        <subtitle-component :subtitle="'Individual reports of tests passed by users'" />
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