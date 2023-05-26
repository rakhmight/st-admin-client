<template>
    <tr>
        <td style="max-width:70px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis; text-align: right;">
            <v-tooltip location="bottom" color="#00000073">
            <template v-slot:activator="{ props }">
                <span v-bind="props" style="cursor: pointer;">{{ test._id }}</span>
            </template>
            <span>{{ test._id }}</span>
            </v-tooltip>
        </td>
        <td>{{ getSubjectName(test.info.params.subject) }}</td>
        <td>{{ test.info.testInfo.totalQuestions }}</td>
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
            </v-list>
            </v-menu>
        </td>
        <td>
            <v-checkbox
            density="compact"
            color="var(--main-color)"
            v-model="choiseTest"
            ></v-checkbox>
        </td>
    </tr>
</template>


<script>
import { getSubject } from '@/plugins/getInfo';
import { mapGetters } from 'vuex';

export default {
    props:{
        test: Object,
        choisingTest: Function
    },
    data(){
        return {
            choiseTest: false
        }
    },
    computed: mapGetters(['getSubjects']),
    methods:{
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        }
    },
    watch:{
        choiseTest(){
            if(this.choiseTest){
                this.choisingTest('add', this.test)
            } else {
                this.choisingTest('remove', this.test)
            }
        }
    }
}
</script>
