<template>
    <div class="err404">
        <h4>您访问的页面不见了！</h4>
        <h5>
            <router-link to="manage" class="go-home">Go Home</router-link>
        </h5>
    </div>
</template>

<script lang="ts">
</script>

<style>
    .err404 h4 {
        font-size: 24px;
        color: #191919;
        padding-bottom: 16px
    }

    .err404 .go-home {
        width: 130px;
        height: 38px;
        background: #c9141d;
        line-height: 38px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        display: inline-block;
        border-radius: 2px
    }
</style>