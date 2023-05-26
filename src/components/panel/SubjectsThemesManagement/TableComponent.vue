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
            :onmouseover="section=='subject' ? 'this.style.backgroundColor=`rgba(0, 0, 0, 0.082)`;this.style.cursor=`pointer`;' : ''"
            :onmouseout="section=='subject' ? 'this.style.backgroundColor=``;' : ''"
            v-if="section=='subject'"
            v-for="(subject, i) in getSubjects"
            :key="i"
            @click="choiseSubject(i)"
            :style="getCurrentSubject && getCurrentSubject._id === subject._id ? 'color:var(--main-color)' : ''"
            >
                <td style="font-size: 0.8em;max-width:70px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis; text-align: right;">             
                    <v-tooltip location="bottom" color="#00000073">
                    <template v-slot:activator="{ props }">
                        <span v-bind="props" style="cursor: pointer;">{{ subject._id }}</span>
                    </template>
                    <span>{{ subject._id }}</span>
                    </v-tooltip>
                </td>
                <td>{{ subject.name.ru }}</td>
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
                                <span class="menu-text">Edit subject</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                <span style="color:var(--red-color)" class="menu-text">Delete subject</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </td>
            </tr>


            
            <tr
            v-if="section=='theme'"
            v-for="(theme, i) in getThemes"
            :key="i"
            >
                <td>{{ theme.id }}</td>
                <td>{{ theme.name.ru }}</td>
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
                                <span class="menu-text">Edit theme</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                <span style="color:var(--red-color)" class="menu-text">Delete theme</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </td>
            </tr>
            </tbody>
        </v-table>

        <div
        v-if="section=='subject' && !getSubjects.length || section == 'theme' && !getThemes.length && getCurrentSubject!==undefined"
        style="height: 60vh; width: 100%;"
        class="d-flex flex-column justify-center align-center"
        >
        <div height="100px">
            <v-img src="@/assets/media/spider-web.png" width="100px"></v-img>
        </div>
        <span class="text-h7 mt-1" style="color: #777">Empty</span>
        </div>

        <div
        v-if="section=='theme' && getCurrentSubject===undefined"
        style="height: 60vh; width: 100%;"
        class="d-flex flex-column justify-center align-center"
        >
        <div style="min-height: 100px;" class="d-flex align-center">
            <v-img src="@/assets/media/list.png" center width="70px"></v-img>
        </div>
        <span class="text-h7 mt-1" style="color: #777">Choise any subject</span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    props:{
        section: String
    },
    data(){
        return {
            subjects: [],
            themes: []
        }
    },
    mounted(){
        if(this.getCurrentSubject){
            this.setThemes(this.getCurrentSubject.themes)
        }
    },
    computed: mapGetters(['getPositions', 'getCurrentSubject', 'getSubjects', 'getThemes']),
    methods:{
        ...mapMutations(['setThemes', 'setCurrentSubject']),

        choiseSubject(key){
            this.setThemes(this.getSubjects[key].themes)
            this.setCurrentSubject(this.getSubjects[key])
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
