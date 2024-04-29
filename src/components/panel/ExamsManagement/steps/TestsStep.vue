<template>
    <div class="form__step">
        <div class="d-flex" style="gap:20px">
            <div>
                <span v-if="choisedSubjects.length<2">Exam in the subject:</span>
                <span v-if="choisedSubjects.length>=2">Comprehensive exam in subjects:</span>
            </div>
            <div class="d-flex flex-column">
                <span v-for="(subject, i) in choisedSubjects" :key="i" style="color: var(--main-color)">{{ i+1 }}. {{ getSubjectName(subject) }}</span>
            </div>
        </div>
        <div class="mt-3">
            <v-select
            label="Select subject"
            :items="subjects"
            density="compact"
            variant="outlined"
            v-model="choisedSubjects"
            multiple
            ></v-select>
        </div>

        <div v-if="choisedSubjects.length && tests.length">
            <v-table
            density="compact"
            >
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
                    Action
                    </th>
                    <th class="text-left">
                    Choise
                    </th>
                </tr>
                </thead>
                <tbody>
                    <test-from-table
                    v-for="(test, i) in tests"
                    :key="i"
                    :test="test"
                    :choisingTest="choisingTest"
                    :switchTest="switchTest"
                    />
                </tbody>
            </v-table>
        </div>

        <data-empty :text="'There are no tests in the selected subject'" v-if="choisedSubjects.length && !tests.length"/>

        <div
        v-if="!choisedSubjects.length"
        style="height: 40vh; width: 100%;"
        class="d-flex flex-column justify-center align-center"
        >
        <div style="min-height: 100px;" class="d-flex align-center">
            <v-img src="@/assets/media/list.png" center width="70px"></v-img>
        </div>
        <span class="text-h7 mt-1" style="color: #777">Choise any subject</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TestInfo from '@/components/TestCard/dialogs/TestInfo.vue';
import TestHistory from '@/components/TestCard/dialogs/TestHistory.vue';
import DataEmpty from '@/components/DataEmpty.vue';
import TestFromTable from '@/components/panel/ExamsManagement/TestFromTable.vue';
import { getSubject } from '@/plugins/getInfo'
import makeReq from '@/services/makeReq'

export default {
    props:{
        choisingTest: Function,
        changeChoisedSubject: Function,
        switchChoisedSubject: Boolean,
        setSubjectPotentialParams: Function
    },
    data(){
        return{
            subjects: [],
            choisedSubjects: [],
            tests: [],
            switchTest: false
        }
    },
    methods:{
        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

        countTests(){
            this.tests = []
            this.choisedSubjects.forEach(subject=>{
                this.getTestImages.forEach(image=>{
                    if(image.status.value=='approved' && image.type=='exam' && image.info.params.subject == subject){
                        this.tests.push(image)
                    }  
                })
            })
        }
    },
    computed: mapGetters(['getSubjects', 'getTestImages', 'getAuthParams', 'getAdminServerIP']),
    mounted(){
        this.getSubjects.map(subject=>{
            const testsAvailable = this.getTestImages.find(ti => ti.info.params.subject == subject.id)

            if(testsAvailable) this.subjects.push({
                title: subject.name.ru,
                value: subject.id
            })
        })
    },
    watch:{
        switchChoisedSubject(){
            this.countTests()
        },

        async choisedSubjects(){
            this.countTests()
            this.changeChoisedSubject(this.choisedSubjects)
            this.switchTest = !this.switchTest

            const paramsData = await Promise.all(this.choisedSubjects.map(async (sub) => {
                try {
                    const subData = await makeReq(`${this.getAdminServerIP}/api/exams/get-last-params`, 'POST', {
                        auth:{
                            ...this.getAuthParams
                        },
                        data: {
                            subject: sub
                        }
                    })

                    if(subData){
                        if(subData.statusCode == 200){
                            if(subData.data.examParams){
                                return {
                                    subject: sub,
                                    params: subData.data.examParams,
                                    isUsed: false
                                }
                            } else return undefined
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            }))

            const params = paramsData.filter(pd => {
                if(pd) return pd
            })

            this.setSubjectPotentialParams(params)
        },
    },
    components:{
        TestInfo,
        TestHistory,
        DataEmpty,
        TestFromTable
    }
}
</script>

<style scoped>
.v-table{
    font-size: 0.9em
}
</style>
