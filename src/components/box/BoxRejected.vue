<template>
    <div class="content">
        <title-component :title="'Rejected tests'" />

        <div class="cards">
            <test-card
            v-for="(test, i) in testsList"
            :key="i"
            :test="test"
            :reRenderTests="reRenderTests"
            />
        </div>

        <v-pagination
        class="mt-3"
        v-model="page"
        :length="pages"
        :total-visible="7"
        density="compact"
        rounded="circle"
        ></v-pagination>

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
            tests: [],
            testsList: [],
            page: 1,
            pageSize: 40,
            listCount: 0
        }
    },
    computed: {
        ...mapGetters(['getTestImages', 'getRole']),
        
		pages() {
			if (this.pageSize == null || this.listCount == null) return 0;
			return Math.ceil(this.listCount / this.pageSize);
		}
    },
    watch: {
        page(){
            this.updatePage(this.page)
        },

        'getTestImages.length'(){
            this.reRenderTests()
            this.initPage();
            this.updatePage(this.page);
        }
    },
    components:{
        TitleComponent,
        TestCard,
        DataEmpty
    },
    mounted(){
        this.reRenderTests()
        this.initPage();
		this.updatePage(this.page);
    },
    methods: {
        reRenderTests(){            
            this.tests = []
            this.getTestImages.forEach((test, i) => {
                const testI = { ...test, number: i+1 }
                
                if(this.getRole==1 || this.getRole==2){
                    if(test.status.value=='rejected'){
                        this.tests.push(testI)
                    }
                } else if(this.getRole==3){
                    if(test.status.value=='rejected' && test.status.rejected=='admin'){
                        this.tests.push(testI)
                    }
                }
            })
        },        

        initPage(){
            this.listCount = []
			this.listCount = this.tests.length;
			if (this.listCount < this.pageSize) {
				this.testsList = this.tests;
			} else {
				this.testsList = this.tests.slice(0, this.pageSize);
			}
		},

        updatePage(pageIndex){
			let _start = (pageIndex - 1) * this.pageSize;
			let _end = pageIndex * this.pageSize;
			this.testsList = this.tests.slice(_start, _end);
			this.page = pageIndex;
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
