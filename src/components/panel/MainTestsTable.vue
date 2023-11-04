<template>
    <div>
        <v-table density="compact">
            <thead>
            <tr>
                <th class="text-left" style="width: 70px">
                ID
                </th>
                <th class="text-left">
                Subject
                </th>
                <th class="text-left">
                Questions count
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
            :key="i"
            >
                <td style="max-width:70px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis; text-align: right;">
                    <v-tooltip location="bottom" color="#00000073">
                    <template v-slot:activator="{ props }">
                        <span v-bind="props" style="cursor: pointer;">{{ test.id }}</span>
                    </template>
                    <span>{{ test.id }}</span>
                    </v-tooltip>
                </td>
                <td>{{ getSubjectName(test.info.params.subject) }}</td>
                <td>{{ test.info.testInfo.totalQuestions }}</td>
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

                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="#eb6517">mdi-keyboard-return</v-icon>
                                <span class="menu-text" style="color: #eb6517">Return</span>
                            </v-list-item-title>
                        </v-list-item>
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
    </div>
</template>

<script>
import { mergeProps } from 'vue'
import TestInfo from '@/components/TestCard/dialogs/TestInfo.vue';
import TestHistory from '@/components/TestCard/dialogs/TestHistory.vue';
import ChangeTestType from '@/components/panel/TestsManagement/dialogs/ChangeTestType';
import { getSubject } from '@/plugins/getInfo';
import { mapGetters } from 'vuex';

export default {
    props:{
        tests: Array
    },
    data(){
        return {
            page: 1,
            pageSize: 40,
            listCount: 0,
            testsList: []
        }
    },
    computed:{
        ...mapGetters(['getSubjects']),
        
		pages() {
			if (this.pageSize == null || this.listCount == null) return 0;
			return Math.ceil(this.listCount / this.pageSize);
		}
    },
    watch: {
        page(){
            this.updatePage(this.page)
        },

        tests(){
            this.initPage();
            this.updatePage(this.page);
        }
    },
    mounted(){
        this.initPage();
		this.updatePage(this.page);
    },
    methods: {
        mergeProps,

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
        ChangeTestType
    }
}
</script>

<style scoped>
.v-table{
    font-size: 0.9em
}
</style>
