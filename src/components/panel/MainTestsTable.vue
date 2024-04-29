<template>
    <div v-if="!getTestsGetting">
        <div v-if="testsList.length">
            <v-table density="compact">
                <thead>
                <tr>
                    <th class="text-center" style="width: 70px">
                    #
                    </th>
                    <th class="text-center" style="width: 70px">
                    ID
                    </th>
                    <th class="text-left">
                    Subject
                    </th>
                    <th class="text-left">
                    Questions count
                    </th>                
                    <th class="text-left">
                    Sign date
                    </th>
                    <th class="text-left">
                    Type
                    </th>
                    <th class="text-left">
                    Actions
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                v-for="(test, i) in testsList"
                :key="test.id"
                >
                    <!-- <td style="max-width:70px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis; text-align: right;">
                        <v-tooltip location="bottom" color="#00000073">
                        <template v-slot:activator="{ props }">
                            <span v-bind="props" style="cursor: pointer;">{{ test.id }}</span>
                        </template>
                        <span>{{ test.id }}</span>
                        </v-tooltip>
                    </td> -->

                    <td class="text-center">{{ i+1 }}</td>

                    <td class="text-center">
                        <v-tooltip location="bottom" color="#00000073">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="#888" class="hover" @click="copy(test.id)">mdi-identifier</v-icon>
                            </template>
                            <span>click to copy</span>
                        </v-tooltip>
                    </td>

                    <td>{{ getSubjectName(test.info.params.subject) }}</td>
                    <td>{{ test.info.testInfo.totalQuestions }}</td>
                    <td>{{ getTestSignDate(test) }}</td>
                    <td>{{ test.type }}</td>
                    <td>
                        <v-menu
                        transition="slide-y-transition"
                        >
                        <template v-slot:activator="{ props }">
                            <v-btn
                            color="var(--main-color)"
                            v-bind="props"
                            density="compact"
                            variant="text"
                            icon="mdi-dots-horizontal"
                            size="35"
                            >
                            </v-btn>
                        </template>
                        <v-list density="compact" min-width="120">

                            <test-info :test="test" />
                            <test-history :test="test" />
                            <change-test-type :test="test" />
                            <return-test :test="test" />

                            <v-list-item>
                                <v-list-item-title class="d-flex align-center">
                                    <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                    <span style="color:var(--red-color)" class="menu-text">Delete</span>
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                        </v-menu>
                    </td>
                </tr>
                </tbody>
            </v-table>        

            <v-pagination
            class="mt-3"
            v-model="page"
            :length="pages"
            :total-visible="7"
            density="compact"
            rounded="circle"
            ></v-pagination>

            <v-snackbar
            v-model="snackbar"
            :timeout="1500"
            color="var(--main-color)"
            variant="tonal"
            >
            Test ID is copied!
            </v-snackbar>
        </div>

        <data-empty :text="'Tests not found'" v-else />
    </div>

    <div class="d-flex justify-center align-center" style="height: 300px" v-else>
        <div class="d-flex flex-column align-center" style="gap: 10px">

            <v-progress-circular
            :rotate="360"
            :size="50"
            :width="3"
            :model-value="loading"
            color="var(--main-color)"
            >
            </v-progress-circular>
            
            <p style="font-size: 0.9rem; color: #555">Loading data. Wait..</p>

        </div>
    </div>
</template>

<script>
import { mergeProps } from 'vue'
import TestInfo from '@/components/TestCard/dialogs/TestInfo.vue';
import TestHistory from '@/components/TestCard/dialogs/TestHistory.vue';
import ReturnTest from '@/components/panel/TestsManagement/dialogs/ReturnTest.vue'
import ChangeTestType from '@/components/panel/TestsManagement/dialogs/ChangeTestType';
import { getSubject, getDate } from '@/plugins/getInfo';
import { mapGetters } from 'vuex';
import DataEmpty from '../DataEmpty.vue';
import { copyToClipBoard } from '@/utils/copyToClipBoard'

export default {
    props:{
        mode: String
    },
    data(){
        return {
            page: 1,
            pageSize: 40,
            listCount: 0,

            tests: [],
            testsList: [],

            snackbar: false,
            
            interval: {},
            loading: 0
        }
    },
    computed:{
        ...mapGetters(['getSubjects', 'getTestImages', 'getTestsDataSwitcher', 'getTestsGetting']),
        
		pages() {
			if (this.pageSize == null || this.listCount == null) return 0;
			return Math.ceil(this.listCount / this.pageSize);
		}
    },
    watch: {
        getTestsGetting(){
            if(!this.getExamsGetting){
                clearInterval(this.interval)  
            }
        },

        getTestsDataSwitcher(){
            this.makeList()
            this.initPage();
            this.updatePage(this.page);
        },

        page(){
            this.updatePage(this.page)
        },

        tests(){
            this.initPage();
            this.updatePage(this.page);
        }
    },
    mounted(){
        this.interval = setInterval(() => {
            if (this.loading === 100) {
            return (this.loading = 0)
            }
            this.loading += 10
        }, 1000)

        this.makeList()
        this.initPage();
		this.updatePage(this.page);
    },
    beforeUnmount () {
      clearInterval(this.interval)
    },
    methods: {
        mergeProps,

        getTestSignDate(test){
            const target = test.history.findLast(item => item.type=='signed')
            return getDate(target.date)
        },

        copy(id){
            copyToClipBoard(id)
            this.snackbar = true
        },

        makeList(){
            this.tests = this.getTestImages.filter(test=>{
            if(this.mode == 'all'){
                if(test.status.value == 'approved') return test
            }else if(this.mode == 'blocked'){
                if(test.status.value == 'approved' && test.type=='blocked') return test
            }else if(this.mode == 'examination'){
                if(test.status.value == 'approved' && test.type=='exam') return test
            }else if(this.mode == 'private'){
                if(test.status.value == 'approved' && test.type=='private') return test
            }else if(this.mode == 'public'){
                if(test.status.value == 'approved' && test.type=='public') return test
            }
        })
        },

        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        initPage(){
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
        TestInfo,
        TestHistory,
        ChangeTestType,
        ReturnTest,
        DataEmpty
    }
}
</script>

<style scoped>
.v-table{
    font-size: 0.9em
}
</style>
