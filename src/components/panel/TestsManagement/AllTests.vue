<template>
    <div class="content">
        <tests-header :window="'all'" />
        <main-tests-table :mode="'all'"/>
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