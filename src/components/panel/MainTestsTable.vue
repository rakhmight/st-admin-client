<template>
    <div>
        <v-table density="compact">
            <thead>
            <tr>
                <th class="text-left" style="width: 70px">
                ID
                </th>
                <th class="text-left">
                Subject
                </th>
                <th class="text-left">
                Questions count
                </th>
                <th class="text-left">
                Type
                </th>
                <th class="text-left">
                Actions
                </th>
            </tr>
            </thead>
            <tbody>
            <tr
            v-for="(test, i) in tests"
            :key="i"
            >
                <td style="max-width:70px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis; text-align: right;">
                    <v-tooltip location="bottom" color="#00000073">
                    <template v-slot:activator="{ props }">
                        <span v-bind="props" style="cursor: pointer;">{{ test._id }}</span>
                    </template>
                    <span>{{ test._id }}</span>
                    </v-tooltip>
                </td>
                <td>{{ getSubjectName(test.info.params.subject) }}</td>
                <td>{{ test.info.testInfo.totalQuestions }}</td>
                <td>{{ test.type }}</td>
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

                        <test-info :test="test" />
                        <test-history :test="test" />
                        <change-test-type :test="test" />

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
import TestInfo from '@/components/TestCard/dialogs/TestInfo.vue';
import TestHistory from '@/components/TestCard/dialogs/TestHistory.vue';
import ChangeTestType from '@/components/panel/TestsManagement/dialogs/ChangeTestType';
import { getSubject } from '@/plugins/getInfo';
import { mapGetters } from 'vuex';

export default {
    props:{
        tests: Array
    },
    computed: mapGetters(['getSubjects']),
    methods: {
        mergeProps,

        getSubjectName(id){
            return getSubject(id, this.getSubjects)
        },

    },
    components:{
        TestInfo,
        TestHistory,
        ChangeTestType
    }
}
</script>

<style scoped>
.v-table{
    font-size: 0.9em
}
</style>
