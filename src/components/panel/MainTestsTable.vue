<template>
    <div>
        <v-table density="compact">
            <thead>
            <tr>
                <th class="text-left">
                ID
                </th>
                <th class="text-left">
                Subject
                </th>
                <th class="text-left">
                Questions count
                </th>
                <th class="text-left">
                Status
                </th>
                <th class="text-left">
                Actions
                </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
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
                        size="35"
                        >
                        </v-btn>
                    </template>
                    <v-list density="compact" min-width="120">
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-information</v-icon>
                                <span class="menu-text">Info</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--main-color)">mdi-pencil</v-icon>
                                <span class="menu-text">Change status</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="#eb6517">mdi-keyboard-return</v-icon>
                                <span class="menu-text" style="color: #eb6517">Return</span>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="d-flex align-center">
                                <v-icon size="18" class="mr-1" color="var(--red-color)">mdi-delete</v-icon>
                                <span style="color:var(--red-color)" class="menu-text">Delete</span>
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
import { mergeProps } from 'vue'

export default {
    methods: {
      mergeProps,
    },
}
</script>

<style scoped>
.v-table{
    font-size: 0.9em
}
</style>
