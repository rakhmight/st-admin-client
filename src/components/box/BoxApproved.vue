<template>
    <div class="content">
        <title-component :title="'Approved tests'" />

        <div class="cards">
            <test-card
            v-for="(test, i) in tests"
            :key="i"
            :test="test"
            />
        </div>

        <data-empty :text="`You don't have approved tests`" v-if="!tests.length" />
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import TestCard from '@/components/TestCard/TestCard';
import DataEmpty from '@/components/DataEmpty';
import { mapGetters } from 'vuex';

export default {
    data(){
        return {
            tests: []
        }
    },
    computed: mapGetters(['getTestImages']),
    components:{
        TitleComponent,
        TestCard,
        DataEmpty
    },
    mounted(){
        this.getTestImages.forEach(testImage=>{
            if(testImage.status.value=='approved'){
                this.tests.push(testImage)
            }
        })
    }
}
</script>

<style scoped>
.cards{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 250px));
    gap: 30px;
    justify-content: space-around;
    padding-bottom: 30px;
}
</style>
