<template>
    <div class="content">
        <title-component :title="'Send for check'" />

        <div class="wrapper">
            <div class="form">
                <div class="form__title mb-5">
                    <span class="text-h5">Upload your work</span>
                    <v-divider class="mt-1"></v-divider>
                </div>
                <div class="form__content">
                    <v-file-input
                    accept="application/json"
                    show-size
                    counter
                    clearable
                    label="File input"
                    density="compact"
                    variant="outlined"
                    ></v-file-input>

                    <div class="w-100 d-flex justify-center mt-5">
                        <v-btn
                        density="compact"
                        color="var(--main-color)"
                        width="200"
                        ><span style="color: #fff">Upload</span></v-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TitleComponent from '@/components/TitleComponent';

export default {
    components:{
        TitleComponent
    }
}
</script>

<style scoped>
.wrapper{
    width: 100%;
    height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center
}
.form{
    padding: 15px;
    background-color: #fff;
    border-radius: 5px;
    width: 600px;
}
</style>
