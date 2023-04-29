<template>
    <div class="wrapper">
        <title-component :title="'Tests management'" />

        <div>
            <v-tabs
            v-model="tab"
            density="compact"
            color="var(--main-color)"
            >
                <v-tab value="all" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">All tests</span></v-tab>
                <v-tab value="private" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Private tests</span></v-tab>
                <v-tab value="public" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Public tests</span></v-tab>
                <v-tab value="examination" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Examination tests</span></v-tab>
                <v-tab value="blocked" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Blocked tests</span></v-tab>
            </v-tabs>

            <v-window v-model="tab" class="mt-5">
                <v-window-item value="all">
                    <all-tests />
                </v-window-item>
                <v-window-item value="private">
                    <private-tests />
                </v-window-item>
                <v-window-item value="public">
                    <public-tests />
                </v-window-item>
                <v-window-item value="examination">
                    <examination-tests />
                </v-window-item>
                <v-window-item value="blocked">
                    <blocked-tests />
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import AllTests from '@/components/panel/TestsManagement/AllTests'
import PrivateTests from '@/components/panel/TestsManagement/PrivateTests'
import PublicTests from '@/components/panel/TestsManagement/PublicTests'
import ExaminationTests from '@/components/panel/TestsManagement/ExaminationTests'
import BlockedTests from '@/components/panel/TestsManagement/BlockedTests'

export default {
    data(){
        return{
            tab: 'all'
        }
    },
    components:{
        TitleComponent,
        AllTests,
        PrivateTests,
        PublicTests,
        ExaminationTests,
        BlockedTests
    }
}
</script>