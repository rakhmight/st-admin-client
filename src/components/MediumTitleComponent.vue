<template>
    <div class="title mb-3">
        <span class="text-h6">{{ title }}</span>
        <v-divider class="mt-1"></v-divider>
    </div>
</template>

<script>
export default {
    props:{
        title: String
    }
}
</script>
