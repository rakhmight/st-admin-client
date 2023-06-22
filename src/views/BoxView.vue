<template>
    <v-container style="margin-top: 54px" v-if="getAuthState">
        <v-tabs
        v-model="tab"
        density="compact"
        >
            <!-- General -->
            <v-tab value="general" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">General</span></v-tab>
            <!-- For inspector & admin -->
            <v-tab value="incoming" style="border-bottom: 1px solid #ccc" v-if="getRole>1"><span class="text-subtitle-2">Incoming</span></v-tab>
            <!-- For author -->
            <v-tab value="send" style="border-bottom: 1px solid #ccc" v-if="getRole==1"><span class="text-subtitle-2">Send for check</span></v-tab>
            <!-- General -->
            <v-tab value="review" style="border-bottom: 1px solid #ccc" v-if="getRole<3"><span class="text-subtitle-2">Under review</span></v-tab>
            <v-tab value="approved" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Approved</span></v-tab>
            <v-tab value="rejected" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Rejected</span></v-tab>
            <v-tab value="statistic" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Statistic</span></v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-5">
            <v-window-item value="general">
                <box-general v-if="!reRenderSwitcher" />
            </v-window-item>
            <v-window-item value="incoming" v-if="getRole>1">
                <box-incoming v-if="!reRenderSwitcher" />
            </v-window-item>
            <v-window-item value="send" v-if="getRole==1">
                <box-send :switchReRender="switchReRender" />
            </v-window-item>
            <v-window-item value="review" v-if="getRole<3">
                <box-review v-if="!reRenderSwitcher" />
            </v-window-item>
            <v-window-item value="approved">
                <box-approved v-if="!reRenderSwitcher" />
            </v-window-item>
            <v-window-item value="rejected">
                <box-rejected v-if="!reRenderSwitcher" />
            </v-window-item>
            <v-window-item value="statistic">
                <box-statistic />
            </v-window-item>
        </v-window>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import BoxGeneral from '@/components/box/BoxGeneral'
import BoxIncoming from '@/components/box/BoxIncoming'
import BoxSend from '@/components/box/BoxSend'
import BoxReview from '@/components/box/BoxReview'
import BoxApproved from '@/components/box/BoxApproved'
import BoxRejected from '@/components/box/BoxRejected'
import BoxStatistic from '@/components/box/BoxStatistic'

export default {
  data(){
    return {  
        tab: 'general',
        reRenderSwitcher: false
    }
  },
  methods:{
    switchReRender(){
        this.reRenderSwitcher = true
        setTimeout(()=>{
            this.reRenderSwitcher = false
        },200)
    }
  },
  computed: mapGetters(["getAuthState", "getRole"]),
  mounted(){
    if(!this.getAuthState){
        this.$router.push('/')
    }
  },
  components:{
    BoxGeneral,
    BoxIncoming,
    BoxSend,
    BoxReview,
    BoxApproved,
    BoxRejected,
    BoxStatistic
  }
}
</script>

<style scoped>
.v-tab--selected{
    color: var(--main-color);
}
</style>
