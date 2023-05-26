<template>
    <div class="form__step">
        <v-tabs
            v-model="tab"
            density="compact"
            color="var(--main-color)"
            >
                <v-tab value="group" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Group select</span></v-tab>
                <v-tab value="single" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Single select</span></v-tab>
            </v-tabs>

            <v-window v-model="tab" class="mt-5">
                <v-window-item value="group">
                    <group-select :usersManagement="usersManagement" />
                </v-window-item>
                <v-window-item value="single">
                    <single-select :usersManagement="usersManagement" :users="users" :choisingUser="choisingUser" :reRenderSingle="reRenderSingle" />
                </v-window-item>
            </v-window>
    </div>
</template>

<script>
import GroupSelect from '@/components/panel/ExamsManagement/GroupSelect.vue';
import SingleSelect from '@/components/panel/ExamsManagement/SingleSelect.vue';

export default {
    props:{
        usersManagement: Function,
        users: Array,
        choisingUser: Function,
        reRenderSingle: Boolean
    },
    data(){
        return{
            tab: 'group'
        }
    },
    components:{
        GroupSelect,
        SingleSelect
    }
}
</script>
