<template>
    <div class="content">
        <div class="form">
            <medium-title-component :title="'Add new exam'" />
        </div>
    </div>
</template>

<script>
import MediumTitleComponent from '@/components/MediumTitleComponent';

export default {
    components:{
        MediumTitleComponent
    }
}
</script>

<style scoped>
.content{
    width: 100%;
}
.form{
    padding: 15px;
    background-color: #fff;
    width: 100%;
    border-radius: 5px;
}
</style>
