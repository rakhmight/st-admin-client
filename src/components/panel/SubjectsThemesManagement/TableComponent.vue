<template>
    <div class="table-wrapper">

        <v-table density="compact" style="font-size: 0.9em">
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
            >
                <td>1</td>
                <td>2</td>
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
                    <v-list density="compact" min-width="120">
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-pencil</v-icon>
                                <span class="menu-text" v-if="section=='subject'">Edit subject</span>
                                <span class="menu-text" v-else>Edit theme</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                <span style="color:var(--red-color)" class="menu-text" v-if="section=='subject'">Delete subject</span>
                                <span style="color:var(--red-color)" class="menu-text" v-else>Delete theme</span>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                    </v-menu>
                </td>
            </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script>
export default {
    props:{
        section: String
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
</style>
