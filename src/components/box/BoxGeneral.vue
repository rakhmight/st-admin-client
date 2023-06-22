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
            v-for="(test, i) in tests"
            :key="i"
            :test="test"
            :reRenderTests="reRenderTests"
            />
        </div>
        
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
            tests: []
        }
    },
    computed: mapGetters(['getTestImages', 'getRole']),
    methods: {
      mergeProps,
      
      reRenderTests(){
        this.tests = []
            
        this.getTestImages.forEach(testImage=>{
            if(this.getRole==1 || this.getRole==2){
                this.tests.push(testImage)
            } else if(this.getRole==3){
                if(testImage.status.value=='under-review' && testImage.status.step==2 || testImage.status.value=='approved' || testImage.status.value=='rejected' && testImage.status.rejected=='admin'){
                    this.tests.push(testImage)
                }
            }
        })
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
