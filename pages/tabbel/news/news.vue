<template>
	<view>
		<view>
				<navTab_loadRefresh  :privateChatList="privateChatList" :group-chat-list="groupChatList"   :viewType="chatType" :totalPage="totalPage" :currentPage = "currPage" :currentTabIndex ='currentTab' :title="tabTitle"  @changeFatherTab="changeTab" @loadMoreData="loadMore" @refreshFatherData = 'refresh'></navTab_loadRefresh>
		</view>
		<button @click="newRoom"  v-if="false">新聊天室</button>
	</view>
</template>

<script src="./news.js"></script>

<style lang="scss" scoped>
 @import "./news";
</style>
