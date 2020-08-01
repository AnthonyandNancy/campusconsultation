<template>
    <view class="componentBox">
        <supportCart :dynamicObj = 'item':key="index" v-for="(item,index) in supportList"></supportCart>
    </view>
</template>

<script src="./mySupport.js"></script>

<style lang="scss" scoped>
    @import "./mySupport";
</style>
