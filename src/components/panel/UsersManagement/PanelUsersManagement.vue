<template>
    <div class="wrapper">
        <title-component :title="'Users management'" />

        <div>
            <v-tabs
            v-model="tab"
            density="compact"
            color="var(--main-color)"
            >
                <v-tab value="all-members" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">All members</span></v-tab>
                <v-tab value="add-member" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Add new member</span></v-tab>
                <v-tab value="multi-add" style="border-bottom: 1px solid #ccc"><span class="text-subtitle-2">Add group of members</span></v-tab>
            </v-tabs>

            <v-window v-model="tab" class="mt-5">
                <v-window-item value="all-members">
                    <main-users-table :mode="'users'" />
                </v-window-item>
                <v-window-item value="add-member">
                    <add-user />
                </v-window-item>
                <v-window-item value="multi-add">
                    <multi-add />
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';
import MainUsersTable from '@/components/panel/MainUsersTable';
import AddUser from './AddUser';
import MultiAdd from './MultiAdd';

export default {
    data(){
        return { 
            tab: 'all-members',
        }
    },
    components:{
        TitleComponent,
        MainUsersTable,
        AddUser,
        MultiAdd
    }
}
</script>

<style>
.v-tab--selected{
    color: var(--main-color);
}
</style>