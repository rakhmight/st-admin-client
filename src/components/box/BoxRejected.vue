<template>
    <div class="content">
        <title-component :title="'Rejected tests'" />

        <div class="cards">
            <test-card
            v-for="(test, i) in tests"
            :key="i"
            :test="test"
            :reRenderTests="reRenderTests"
            />
        </div>

        <data-empty :text="`You don't have rejected tests`" v-if="!tests.length" />
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
    computed: mapGetters(['getTestImages', 'getRole']),
    components:{
        TitleComponent,
        TestCard,
        DataEmpty
    },
    mounted(){
        this.reRenderTests()
    },
    methods:{
        reRenderTests(){
            this.tests = []
            
            this.getTestImages.forEach(testImage=>{
                if(this.getRole==1 || this.getRole==2){
                    if(testImage.status.value=='rejected'){
                        this.tests.push(testImage)
                    }
                } else if(this.getRole==3){
                    if(testImage.status.value=='rejected' && testImage.status.rejected=='admin'){
                        this.tests.push(testImage)
                    }
                }
            })
        }
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
