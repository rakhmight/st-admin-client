<template>
    <div class="form pt-5">
        <div style="display:grid; grid-template-columns: 80% auto; gap: 10px" class="mr-1">
            <v-text-field
            :label="section=='subject' ? 'Subject name' : 'Theme name'"
            variant="outlined"
            density="compact"
            ></v-text-field>
            <v-select
            variant="outlined"
            density="compact"
            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            prepend-inner-icon="mdi-translate"
            ></v-select>
        </div>
        <div class="d-flex flex-row justify-space-between align-center">
            <v-tooltip text="Add translate" location="top">
            <template v-slot:activator="{ props }">
                <v-btn
                v-bind="props"
                density="compact"
                icon
                color="var(--main-color)"
                size="26"
                >
                    <v-icon color="#fff" size="18">mdi-translate</v-icon>
                </v-btn>
            </template>
            </v-tooltip>
            <v-tooltip text="Add translate" location="top">
            <template v-slot:activator="{ props }">
                <v-btn
                v-bind="props"
                density="compact"
                color="var(--main-color)"
                class="mr-1"
                >
                    <span style="color: #fff; font-size: 0.9em;" v-if="section=='subject'">Add subject</span>
                    <span style="color: #fff; font-size: 0.9em;" v-else>Add theme</span>
                </v-btn>
            </template>
            </v-tooltip>
        </div>
        <v-divider class="pb-3 mt-2"></v-divider>
    </div>
</template>

<script>
export default {
    props:{
        section: String
    }
}
</script>
