<template>
    <v-container style="margin-top: 54px">
        <v-tabs
        v-model="tab"
        density="compact"
        >
            <!-- General -->
            <v-tab value="general"><span class="text-subtitle-2">General</span></v-tab>
            <!-- For inspector & admin -->
            <v-tab value="incoming"><span class="text-subtitle-2">Incoming</span></v-tab>
            <!-- For author -->
            <v-tab value="send"><span class="text-subtitle-2">Send for check</span></v-tab>
            <!-- General -->
            <v-tab value="review"><span class="text-subtitle-2">Under review</span></v-tab>
            <v-tab value="approved"><span class="text-subtitle-2">Approved</span></v-tab>
            <v-tab value="rejected"><span class="text-subtitle-2">Rejected</span></v-tab>
            <v-tab value="statistic"><span class="text-subtitle-2">Statistic</span></v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-5">
            <v-window-item value="general">
                <box-general />
            </v-window-item>
            <v-window-item value="incoming">
                <box-incoming />
            </v-window-item>
            <v-window-item value="send">
                <box-send />
            </v-window-item>
            <v-window-item value="review">
                <box-review />
            </v-window-item>
            <v-window-item value="approved">
                <box-approved />
            </v-window-item>
            <v-window-item value="rejected">
                <box-rejected />
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
        tab: null,
    }
  },
  computed: mapGetters(["getAuthState"]),
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
