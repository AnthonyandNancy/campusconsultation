<template>
    <view class="componentBox">

        <load-refresh ref="hideLoading"
                      :isRefresh="true"
                      :refreshTime="800"
                      :heightReduce="loadRefreshHeight"
                      :backgroundCover="'#fff'"
                      :pageNo="currPage"
                      :totalPageNo="totalPage"
                      @loadMore="loadMore"
                      @refresh="refresh">

            <view slot="content-list">

                <supportCart :dynamicObj = 'item':key="index" v-for="(item,index) in supportList"></supportCart>

            </view>
        </load-refresh>


    </view>
</template>

<script src="./mySupport.js"></script>

<style lang="scss" scoped>
    @import "./mySupport";
</style>
