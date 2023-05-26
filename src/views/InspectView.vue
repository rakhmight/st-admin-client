<template>
    <v-container v-if="getAuthState">
        <div class="content">
            <div class="inspect" style="padding-top: 54px;">

                <inspect-sidebar :questions="questions" :loader="loader" :testOptions="params" :blockAllBtns="blockAllBtns"/>

                <div class="inspect__sidebar-box"></div>
                
                <inspect-board :questions="questions" :loader="loader" :testParams="params" :makeRemark="makeRemark" :remarks="remarks" :blockAllBtns="blockAllBtns"/>

            </div>

            <inspect-tools :remarks="remarks" :test="test" :makeRemark="makeRemark" :loader="loader" :blockAllBtnsFunc="blockAllBtnsFunc"/>
        </div>
    </v-container>
</template>

<script>
import InspectBoard from '@/components/inspect/InspectBoard';
import InspectSidebar from '@/components/inspect/InspectSidebar';
import InspectTools from '@/components/inspect/InspectTools';
import { mapGetters } from 'vuex'
import makeReq from '@/services/makeReq'

export default {
    data(){
        return {
            questions: [],
            loader: true,
            params: {},
            test: undefined,

            remarks: [],
            blockAllBtns: false
        }
    },
    computed: mapGetters(["getAuthState", "getRole", 'getInspectTest', 'getAuthParams', 'getAdminServerIP']),
    mounted() {
        if(!this.getAuthState){
            this.$router.push('/')
        }
        if(this.getRole=='author'){
            this.$router.push('/box')
        }
        if(!this.getInspectTest){
            this.$router.push('/box')
        }

        makeReq(`${this.getAdminServerIP}/api/test/gettest`, 'POST', {
            ...this.getAuthParams,
            data:{
                id: this.getInspectTest
            }
        })
        .then(data=>{
            if(data.statusCode==200){
                this.loader = false
                this.test = JSON.parse(data.data)

                this.questions = this.test.questions
                this.params = this.test.params
            }
        })
        .catch(error=>{
            console.error(error);
            this.$router.push('/box')
        })
    },
    components:{
        InspectBoard,
        InspectSidebar,
        InspectTools
    },
    methods:{
        makeRemark(id, remark, type){
            if(remark){
                if(type=='question'){
                    const target = this.remarks.find(item=>item.question==id)
                    if(target){
                        const index = this.remarks.indexOf(target)
                        this.remarks[index].msg = remark
                    }else{
                        this.remarks.push({
                            type,
                            question: id,
                            msg: remark
                        })
                    }
                } else if(type=='general'){
                    const target = this.remarks.find(item=>item.type=='general')
                    if(target){
                        const index = this.remarks.indexOf(target)
                        this.remarks[index].msg = remark
                    }else{
                        this.remarks.push({
                            type,
                            msg: remark
                        })
                    }
                }
            }else{
                if(type=='question'){
                    const target = this.remarks.find(item=>item.question==id)
                    if(target){
                        const index = this.remarks.indexOf(target)
                        this.remarks.splice(index, 1)
                    }
                } else if(type=='general'){
                    const target = this.remarks.find(item=> item.type=='general')
                    if(target){
                        const index = this.remarks.indexOf(target)
                        this.remarks.splice(index, 1)
                    }
                }
            }
        },

        blockAllBtnsFunc(){
            this.blockAllBtns = true
        }
    }
}
</script>

<style scoped>
.v-container{
    height: 100%;
}
.content{
    position: relative;
    height: 100%;
    width: 100%;
}
.inspect{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 270px auto;
    gap:20px;
    position: relative;
}
</style>
