<template>
    <div class="columns">
        <div></div>

        <div class="box">
            <draggable :list="examsOrder" @change="drag">
            <div
                class="item"
                v-for="element in examsOrder"
                :key="element"
            >
                <div style="color: var(--main-color)">{{ getIndex(element) }}.</div>
                <div>{{ getSubjectName(element) }}</div>
            </div>
            </draggable>
        </div>

        <div class="d-flex align-center">
            <v-icon size="18" color="var(--main-color)">mdi-information-outline</v-icon>
            <span class="ml-1" style="color: #777">drag with mouse</span>
        </div>
    </div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next'
import { getSubject } from '@/plugins/getInfo'
import { mapGetters } from 'vuex'

export default {
    components:{
      draggable: VueDraggableNext,
    },
    props:{
        complex: Array,
        paramsManagement: Function,
        switchTests: Boolean
    },
    data(){
        return {
            enabled: true,
            dragging: false,
            examsOrder: [],
        }
    },
    computed: mapGetters(['getSubjects']),
    methods:{
      drag(event) {
        this.paramsManagement(undefined, 'exams-order', this.examsOrder)
      },

      countSubjects(){
        this.examsOrder = []
        this.complex.forEach(exam=>{
            this.examsOrder.push(exam.subject)
        })
        
        this.paramsManagement(undefined, 'exams-order', this.examsOrder)
      },

      getIndex(id){
        return (this.examsOrder.indexOf(id))+1
      },

      getSubjectName(id){
        return getSubject(id, this.getSubjects)
      }
    },
    mounted(){
        this.countSubjects()
    },
    watch:{
        switchTests(){
            this.countSubjects()
        }
    }
}
</script>

<style scoped>
.box{
    padding: 5px;
}
.item{
    padding: 7px 5px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 15px;
}

.item:hover{
    cursor: grab;
}
.item:active{
    cursor: grabbing;
}
</style>
