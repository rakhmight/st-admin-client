<template>
    <div class="wrapper">
        <title-component :title="'Reports'" />

        <div>
            <v-tabs
            v-model="tab"
            density="compact"
            color="var(--main-color)"
            >
                <v-tab value="summary" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Summary exam reports</span></v-tab>
                <v-tab value="individual" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Individual reports</span></v-tab>
            </v-tabs>

            <v-window v-model="tab" class="mt-5">
                <v-window-item value="summary">
                    <summary-reports />
                </v-window-item>
                <v-window-item value="individual">
                    <individual-reports />
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import SummaryReports from '@/components/panel/ReportsGeneral/SummaryReports';
import IndividualReports from '@/components/panel/ReportsGeneral/IndividualReports';

export default {
    data() {
        return {
            tab: 'summary'
        }
    },
    components:{
        TitleComponent,
        SummaryReports,
        IndividualReports
    }
}
</script>