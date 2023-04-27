<template>
    <div class="inspect__content">

        <!-- Loader -->
        <div class="d-flex justify-center" style="margin-top:200px" v-if="loader">
            <v-progress-circular
            :size="50"
            :width="3"
            color="var(--main-color)"
            indeterminate
            ></v-progress-circular>
        </div>

        <!-- Question template -->
        <inspect-question
        v-for="(question,i) in questions"
        :question="question"
        :key="i"
        :serialNumber="i+1"
        :testParams="testParams"
        :questions="questions"
        :makeRemark="makeRemark"
        :blockAllBtns="blockAllBtns"
        />
        <!--  -->

        <!-- No questions -->
        <div v-if="questions.length==0 && !loader" class="d-flex flex-column justify-center align-center" style="height:400px;background-color: #aaaaaa80;border-radius: 5px;">
            <div>
                <v-img
                width="120"
                src="@/assets/media/spider-web.png"
                contain
                transition="scale-transition"
                ></v-img>
            </div>
            <h2 style="color:#888" class="text-h6 mt-3">No questions</h2>
        </div>

    </div>
</template>

<script>
import InspectQuestion from '@/components/inspect/InspectQuestion';

export default {
    props: {
        questions: Array,
        loader: Boolean,
        testParams: Object,
        remarks: Array,
        makeRemark: Function,
        blockAllBtns: Boolean
    },
    components:{
        InspectQuestion
    }
}
</script>

<style scoped>
.inspect__content{
    margin-bottom: 90px;
    text-align: justify;
    display: grid;
    grid-template-rows: auto;
    gap: 40px;
}
</style>
