<template>
    <div class="content">
        <title-component :title="'Incoming requests'" />
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import TestCard from '@/components/TestCard';

export default {
    components:{
        TitleComponent,
        TestCard
    }
}
</script>