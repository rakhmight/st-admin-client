<template>
    <div class="content">
        <title-component :title="'Under review'" />

        <div class="cards">
            <test-card
            v-for="(test, i) in tests"
            :key="i"
            :test="test"
            />
        </div>

        <data-empty :text="`You don't have tests under review`" v-if="!tests.length" />
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
        this.getTestImages.forEach(testImage=>{
            if(this.getRole=='author'){
                if(testImage.status.value=='under-review'){
                    this.tests.push(testImage)
                }
            } else if(this.getRole=='inspector'){
                if(testImage.status.value=='under-review' && testImage.status.step==2){
                    this.tests.push(testImage)
                }
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

.v-btn--size-default{
    min-width: 0
}
.v-list-item--density-compact.v-list-item--one-line{
    min-height: 0;
}
.v-list{
    padding:0;
}
.v-list-item{
    cursor: pointer;
}
.v-list-item:hover{
    background-color: rgba(0, 0, 0, 0.162)
}
</style>
