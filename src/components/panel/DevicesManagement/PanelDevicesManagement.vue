<template>
    <div class="wrapper">
        <title-component :title="'Devices management'" />

        <div>
            <v-tabs
            v-model="tab"
            density="compact"
            color="var(--main-color)"
            >
                <v-tab value="devices" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">All devices</span></v-tab>
            </v-tabs>

            <v-window v-model="tab" class="mt-5">
                <v-window-item value="devices">
                    <devices-table />
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import DevicesTable from '@/components/panel/DevicesManagement/DevicesTable.vue';

export default {
    data(){
        return {
            tab: 'devices'
        }
    },
    components:{
        TitleComponent,
        DevicesTable
    }
}
</script>