<template>
    <div class="title">
        <div class="d-flex flex-row align-center justify-space-between mb-2">
            <span class="text-h6" v-if="section=='subject'">Subjects</span>
            <span class="text-h6" v-if="section=='theme'">Themes</span>
            <div>
                <v-tooltip text="Print" location="top" v-if="section=='themes'">
                <template v-slot:activator="{ props }">
                    <v-btn
                    v-bind="props"
                    density="compact"
                    icon
                    color="#424242"
                    size="24"
                    class="mr-3"
                    >
                    <v-icon size="18">mdi-printer</v-icon>
                    </v-btn>
                </template>
                </v-tooltip>
                <v-tooltip text="Add new" location="left">
                <template v-slot:activator="{ props }">
                    <v-btn
                    v-bind="props"
                    density="compact"
                    icon="mdi-plus"
                    color="var(--main-color)"
                    size="24"
                    class="mr-3"
                    ></v-btn>
                </template>
                </v-tooltip>
            </div>
        </div>
        <v-divider></v-divider>
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
.v-btn--icon{
    color: #fff
}
</style>
