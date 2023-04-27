<template>
    <div class="inspect__tools d-flex flex-row align-center justify-center">
        <div style="width:50%;margin-bottom: -20px;">
            <v-text-field
            bg-color="#fff"
            density="compact"
            label="Describe the general remark"
            variant="outlined"
            rows="1"
            color="var(--red-color)"
            v-model="generalRemark"
            clearable
            :disabled="loader || blockAllBtns"
            ></v-text-field>
        </div>

        <v-btn
        width="200px"
        density="compact"
        :color="loader || blockAllBtns ? '#777' : 'var(--main-color)'"
        class="ml-5"
        v-if="!remarks.length"
        :disabled="loader || blockAllBtns"
        @click="approveTest()"
        >
            <span style="color: #fff" v-if="!blockAllBtns">Approve test</span>
            <v-progress-circular
            :width="1"
            size="15"
            color="var(--main-color)"
            indeterminate
            v-else
            ></v-progress-circular>
        </v-btn>

        <v-btn
        width="200px"
        density="compact"
        :color="loader || blockAllBtns ? '#777' : 'var(--red-color)'"
        class="ml-5"
        :disabled="loader || blockAllBtns"
        @click="rejectTest()"
        v-else
        >
            <span style="color: #fff" v-if="!blockAllBtns">Reject test</span>
            <v-progress-circular
            :width="1"
            size="15"
            color="var(--main-color)"
            indeterminate
            v-else
            ></v-progress-circular>
        </v-btn>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import makeReq from '@/services/makeReq'

export default {
    props:{
        remarks: Array,
        test: Object || undefined,
        makeRemark: Function,
        loader: Boolean,
        blockAllBtnsFunc: Function
    },
    computed: mapGetters(['getAuthParams', 'getInspectTest', 'getRole']),
    data(){
        return {
            generalRemark: undefined,
            blockAllBtns: false
        }
    },
    watch:{
        generalRemark(){
            this.makeRemark(undefined ,this.generalRemark, 'general')
        }
    },
    methods:{
        ...mapMutations(['replaceTestImages']),
        async approveTest(){
            if(!this.remarks.length){
                this.blockAllBtns = true
                this.blockAllBtnsFunc()
                // если inspector - поменять step
                await makeReq('http://localhost:4500/api/test/append', 'POST', {
                    ...this.getAuthParams,
                    data: {
                        id: this.getInspectTest,
                        history: [
                            ...this.test.history,
                            {date: new Date(), type:'append-inspector'}
                        ]
                    }
                })
                .then((data)=>{
                    if(data.statusCode == 200){
                        this.replaceTestImages(data.data)
                        this.$router.push('/box')
                    }
                })

                // если admin:
                // - поменять status
                // - удалить тесты из FS st-server
                // - загрузить тесты на сервер exam
            }
        },
        async rejectTest(){
            if(this.remarks.length){
                this.blockAllBtns = true
                this.blockAllBtnsFunc()
                // если inspector:
                // - сменить status
                // - приклеить remarks

                // если admin:
                // - сменить status
                // - приклеить remarks
                await makeReq('http://localhost:4500/api/test/reject', 'POST', {
                    ...this.getAuthParams,
                    data: {
                        id: this.getInspectTest,
                        remarks: this.remarks,
                        history: [
                            ...this.test.history,
                            {
                                date: new Date(),
                                type: this.getRole=='inspector' ? 'rejected-inspector' : this.getRole=='admin' ? 'rejected-admin' : 'unknown'
                            }
                        ]
                    }
                })
                .then(data=>{
                    if(data.statusCode == 200){
                        this.replaceTestImages(data.data)
                        this.$router.push('/box')
                    }
                })
            }
        }
    }
}
</script>

<style scoped>
.inspect__tools{
    position: fixed;
    bottom: 0;
    left:0;
    width: 100%;
    height: 70px;
    background: #444;
}
</style>
