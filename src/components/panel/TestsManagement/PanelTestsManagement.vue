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
                <v-tab value="limited" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Limited tests</span></v-tab>
                <v-tab value="free" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Free tests</span></v-tab>
                <v-tab value="examination" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Examination tests</span></v-tab>
                <v-tab value="blocked" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Blocked tests</span></v-tab>
            </v-tabs>

            <v-window v-model="tab" class="mt-5">
                <v-window-item value="all">
                    <all-tests />
                </v-window-item>
                <v-window-item value="limited">
                    <limited-tests />
                </v-window-item>
                <v-window-item value="free">
                    <free-tests />
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
import LimitedTests from '@/components/panel/TestsManagement/LimitedTests'
import FreeTests from '@/components/panel/TestsManagement/FreeTests'
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
        LimitedTests,
        FreeTests,
        ExaminationTests,
        BlockedTests
    }
}
</script>