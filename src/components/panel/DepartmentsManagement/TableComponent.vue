<template>
    <div class="table-wrapper">

        <v-table density="compact" style="font-size: 0.9em" theme="light">
            <thead>
            <tr>
                <th class="text-center" min-width="30px" width="30px">
                ID
                </th>
                <th class="text-left">
                Name
                </th>
                <th class="text-center" min-width="50px" width="50px">
                Actions
                </th>
            </tr>
            </thead>
            <tbody>
            <tr
            :onmouseover="section=='department' ? 'this.style.backgroundColor=`rgba(0, 0, 0, 0.082)`;this.style.cursor=`pointer`;' : ''"
            :onmouseout="section=='department' ? 'this.style.backgroundColor=``;' : ''"
            v-if="section=='department'"
            v-for="(department, i) in getDepartments"
            :key="department.id"
            @click="choiseDepartment(i, department.id)"
            :style="getCurrentDepartment && getCurrentDepartment.id === department.id ? 'color:var(--main-color)' : ''"
            >
                <td style="font-size: 0.8em;max-width:70px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis; text-align: right;">             
                    <v-tooltip location="bottom" color="#00000073">
                    <template v-slot:activator="{ props }">
                        <span v-bind="props" style="cursor: pointer;">{{ department.id }}</span>
                    </template>
                    <span>{{ department.id }}</span>
                    </v-tooltip>
                </td>
                <td>{{ department.name.ru }}</td>
                <td>
                    <v-menu
                    transition="slide-y-transition"
                    >
                    <template v-slot:activator="{ props }">
                        <v-btn
                        color="var(--main-color)"
                        v-bind="props"
                        density="compact"
                        variant="text"
                        icon="mdi-dots-horizontal"
                        size="30"
                        >
                        </v-btn>
                    </template>
                    <v-list min-width="120" density="compact">
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-pencil</v-icon>
                                <span class="menu-text">Edit department</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                <span style="color:var(--red-color)" class="menu-text">Delete department</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </td>
            </tr>


            
            <tr
            v-if="section=='position'"
            v-for="(position) in getPositions"
            :key="position.id"
            >
                <td>{{ position.id }}</td>
                <td>{{ position.name.ru }}</td>
                <td>
                    <v-menu
                    transition="slide-y-transition"
                    >
                    <template v-slot:activator="{ props }">
                        <v-btn
                        color="var(--main-color)"
                        v-bind="props"
                        density="compact"
                        variant="text"
                        icon="mdi-dots-horizontal"
                        size="30"
                        >
                        </v-btn>
                    </template>
                    <v-list min-width="120" density="compact">
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-pencil</v-icon>
                                <span class="menu-text">Edit position</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                <span style="color:var(--red-color)" class="menu-text">Delete position</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </td>
            </tr>
            </tbody>
        </v-table>

        <div
        v-if="section=='department' && !getDepartments.length || section == 'position' && !getPositions.length && getCurrentDepartment!==undefined"
        style="height: 60vh; width: 100%;"
        class="d-flex flex-column justify-center align-center"
        >
        <div height="100px">
            <v-img src="@/assets/media/spider-web.png" width="100px"></v-img>
        </div>
        <span class="text-h7 mt-1" style="color: #777">Empty</span>
        </div>

        <div
        v-if="section=='position' && getCurrentDepartment===undefined"
        style="height: 60vh; width: 100%;"
        class="d-flex flex-column justify-center align-center"
        >
        <div style="min-height: 100px;" class="d-flex align-center">
            <v-img src="@/assets/media/list.png" center width="70px"></v-img>
        </div>
        <span class="text-h7 mt-1" style="color: #777">Choise any department</span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { copyToClipBoard } from '@/utils/copyToClipBoard'

export default {
    props:{
        section: String
    },
    data(){
        return {
            departments: [],
            positions: []
        }
    },
    mounted(){
        if(this.getCurrentDepartment){
            this.setPositions(this.getCurrentDepartment.positions)
        }

        console.log(this.getCurrentDepartment);
    },
    computed: mapGetters(['getPositions', 'getCurrentDepartment', 'getDepartments']),
    methods:{
        ...mapMutations(['setPositions', 'setCurrentDepartment']),

        choiseDepartment(key, id){
            this.setPositions(this.getDepartments[key].positions)
            this.setCurrentDepartment(this.getDepartments[key])

            copyToClipBoard(id)
        }
    }
}
</script>

<style scoped>
.table-wrapper{
    height: 100%;
    overflow-y: scroll;
}
::-webkit-scrollbar {
    width: 6px;
}
.v-list{
    padding: 0;
}
</style>
