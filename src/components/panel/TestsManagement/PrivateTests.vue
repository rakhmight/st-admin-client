<template>
    <div class="content">
        <tests-header :window="'private'" v-if="tests.length"/>
        <main-tests-table :tests="tests" v-if="tests.length"/>
        
        <data-empty :text="'Private tests not found'" v-if="!tests.length" />
    </div>
</template>

<script>
import MainTestsTable from '@/components/panel/MainTestsTable';
import TestsHeader from '@/components/panel/TestsManagement/TestsHeader';
import { mapGetters } from 'vuex';
import DataEmpty from '@/components/DataEmpty';

export default {
    data(){
        return{
            tests: []
        }
    },
    computed: mapGetters(['getTestImages']),
    mounted(){
        this.tests = this.getTestImages.filter(test=>{
            if(test.status.value == 'approved' && test.type=='private'){
                return test
            }
        })
    },
    components:{
        MainTestsTable,
        TestsHeader,
        DataEmpty
    }
}
</script>