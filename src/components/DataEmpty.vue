<template>
    <div
        class="d-flex flex-column align-center justify-center"
        style="width: 100%; height: 40vh"
        >
            <div>
                <v-img
                src="@/assets/media/spider-web.png"
                width="100px"
                ></v-img>
            </div>
            <span class="mt-3" style="color:#444">{{ text }}</span>
        </div>
</template>

<script>
export default {
    props:{
        text: String
    }
}
</script>
