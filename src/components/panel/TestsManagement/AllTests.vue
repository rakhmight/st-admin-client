<template>
    <div class="content">
        <tests-header :window="'all'" :getTestsList="getTestsList" />
        <main-tests-table :mode="'all'"/>
    </div>
</template>

<script>
import MainTestsTable from '@/components/panel/MainTestsTable';
import TestsHeader from '@/components/panel/TestsManagement/TestsHeader';
import xlsx from "json-as-xlsx"
import { getSubject, getDate, getLanguages } from '@/plugins/getInfo';
import { mapGetters } from 'vuex';

export default {
    components:{
        MainTestsTable,
        TestsHeader
    },
    computed: mapGetters(['getTestImages', 'getSubjects']),
    methods: {
        getTestsList(){
            const doc = [{
                sheet: 'Testlar',
                columns: [
                    { label: "№", value: "number" },
                    { label: "Fan", value: "subject" },
                    { label: "Savollar soni", value: "questions" },
                    { label: "Til", value: "lang" },
                    { label: "Imzollangan sanasi", value: "signDate" },
                ],
                content: []
            }]

            const resultsToDoc = this.getTestImages.map((testImage,i)=>{
                return {
                    number: i+1,
                    subject: getSubject(testImage.info.params.subject, this.getSubjects),
                    questions: testImage.info.testInfo.totalQuestions,
                    lang: getLanguages(testImage.info.params.languagesSettings.languages),
                    signDate: this.getTestSignDate(testImage)
                }
            })


            doc[0].content = resultsToDoc

            let settings = {
                fileName: `Тестлар руйхати`,
                //extraLength: 3,
                writeMode: "writeFile",
                writeOptions: {},
                RTL: false,
            }

            xlsx(doc, settings)
        },

        
        getTestSignDate(test){
            const target = test.history.findLast(item => item.type=='signed')
            return getDate(target.date)
        },
    }
}
</script>