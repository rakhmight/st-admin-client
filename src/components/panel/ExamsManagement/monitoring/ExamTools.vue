<template>
    
    <div class="actions d-flex justify-space-between">
        <div class="d-flex" style="gap: 40px">
            <div>  
                <div v-if="!getCurrentExam.hasBegun && getCurrentExam.examDateParams.start.byCommand">
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <v-btn
                            v-bind="props"
                            icon="mdi-play"
                            variant="text"
                            density="compact"
                            color="var(--main-color)"
                            @click="updateExam(getCurrentExam, 'begun')"
                            >
                            </v-btn>
                        </template>
                        <span>Start exam</span>
                    </v-tooltip>
                </div>
                <div v-if="getCurrentExam.hasBegun && getCurrentExam.examDateParams.end.byCommand">
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <v-btn
                            v-bind="props"
                            icon="mdi-stop"
                            variant="text"
                            density="compact"
                            color="var(--red-color)"
                            @click="updateExam(getCurrentExam, 'stopped')"
                            >
                            </v-btn>
                        </template>
                        <span>Stop exam</span>
                    </v-tooltip>
                </div>
            </div>

            <div class="d-flex" style="gap:7px">
                <div>
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <v-btn
                            v-bind="props"
                            icon="mdi-restart"
                            variant="text"
                            density="compact"
                            color="#ffa03b"
                            >
                            </v-btn>
                        </template>
                        <span>Mulligan management</span>
                    </v-tooltip>
                </div>
                <div>
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <v-btn
                            v-bind="props"
                            icon
                            variant="text"
                            density="compact"
                            color="var(--main-color)"
                            >
                                <v-icon size="22px">mdi-file-document-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Get results</span>
                    </v-tooltip>
                </div>
                <div>
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <v-btn
                            v-bind="props"
                            icon
                            variant="text"
                            density="compact"
                            color="var(--main-color)"
                            >
                                <v-icon size="22px">mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit params of exam</span>
                    </v-tooltip>
                </div>
            </div>
        </div>

        <div class="d-flex" style="gap: 7px">
            <div>
                <v-tooltip>
                    <template v-slot:activator="{ props }">
                        <v-btn
                        v-bind="props"
                        icon
                        variant="text"
                        density="compact"
                        color="#858585"
                        >
                            <v-icon size="22px">mdi-archive-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Archive exam</span>
                </v-tooltip>
            </div>
            <div>
                <v-tooltip>
                    <template v-slot:activator="{ props }">
                        <v-btn
                        v-bind="props"
                        icon
                        variant="text"
                        density="compact"
                        color="var(--red-color)"
                        >
                            <v-icon size="22px">mdi-delete-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Delete exam</span>
                </v-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        updateExam: Function
    },
    computed: mapGetters(['getCurrentExam']),
}
</script>
