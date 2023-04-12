<template>
    <div class="content">
        <tests-header :window="'free'"/>
        <main-tests-table />
    </div>
</template>

<script>
import MainTestsTable from '@/components/panel/MainTestsTable';
import TestsHeader from '@/components/panel/TestsManagement/TestsHeader';

export default {
    components:{
        MainTestsTable,
        TestsHeader
    }
}
</script>