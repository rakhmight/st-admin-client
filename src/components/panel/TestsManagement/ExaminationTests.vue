<template>
    <div class="content">
        <tests-header :window="'examination'"/>
        <main-tests-table :mode="'examination'"/>
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