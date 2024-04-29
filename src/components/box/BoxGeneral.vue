<template>
    <div class="content">
        <title-component :title="'General window'" />
        <!--  -->
        <div class="tools">
            <div class="tool tools__search-bar">
                <v-text-field
                clearable
                label="Поск по id, автору, количеству вопросов"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                ></v-text-field>
            </div>
            <div class="tool tools__sort">
                <v-menu
                transition="slide-y-transition"
                location="bottom center"
                >
                <template v-slot:activator="{ props: menu  }">
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props: tooltip }">
                            <v-btn
                            color="var(--main-color)"
                            v-bind="mergeProps(menu, tooltip)"
                            >
                            <v-icon color="#fff">mdi-sort</v-icon>
                            </v-btn>
                        </template>
                        <span>Sort</span>
                    </v-tooltip>
                </template>
                    <v-list density="compact">
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">by date</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">only verifiable</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">only returned</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">only under review</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                <v-icon size="13" class="mr-1">mdi-play</v-icon>
                                <span class="menu-text">by questions count</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <div class="tool tools__groups">
                <v-select
                clearable
                label="Select group/chair"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                variant="outlined"
                density="compact"
                ></v-select>
            </div>
            <div class="tool tools__authors">
                <v-select
                clearable
                label="Select author"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                variant="outlined"
                density="compact"
                ></v-select>
            </div>
        </div>

        <div class="cards">
            <test-card
            v-for="(test, i) in testsList"
            :key="i"
            :test="test"
            :reRenderTests="reRenderTests"
            />
        </div>

        <v-pagination
        v-if="testsList.length"
        class="mt-3"
        v-model="page"
        :length="pages"
        :total-visible="7"
        density="compact"
        rounded="circle"
        ></v-pagination>
        
        <data-empty :text="getRole == 'author' ? `You haven't uploaded tests yet` : 'Tests not found'" v-if="!tests.length" />
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import TestCard from '@/components/TestCard/TestCard';
import DataEmpty from '@/components/DataEmpty';
import { mergeProps } from 'vue'
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
    methods: {
        mergeProps,
      
        reRenderTests(){     
            console.log(1);       
            this.tests= []
            this.getTestImages.forEach((test, i) => {
                const testI = { ...test, number: i+1 }
                
                if(this.getRole==1 || this.getRole==2) this.tests.push(testI)
                else if(this.getRole==3) {
                    if(test.status.value=='under-review' && test.status.step==2 || test.status.value=='approved' || test.status.value=='rejected' && test.status.rejected=='admin') this.tests.push(testI)
                }
            })
            
            this.initPage();
            this.updatePage(this.page);
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
    },
    components:{
        TitleComponent,
        TestCard,
        DataEmpty
    },
    mounted(){
        this.reRenderTests()
    },
}
</script>

<style scoped>
.tools{
    display: grid;
    grid-template-columns: 55% 50px auto auto;
    gap: 15px;
}
.tool{
    width: 100%;
}

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
