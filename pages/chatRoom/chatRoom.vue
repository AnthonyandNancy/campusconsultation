<template>
	<view>
		<view @touchstart="hideDrawer" class="content">
			<scroll-view :scroll-into-view="scrollToView" :scroll-top="scrollTop" :scroll-with-animation="scrollAnimation" @scrolltoupper="loadHistory" class="msg-list" scroll-y="true" upper-threshold="50">
				<!-- 加载历史数据waitingUI -->
<!--				<view class="loading">-->
<!--					<view class="spinner">-->
<!--						<view class="rect1"></view>-->
<!--						<view class="rect2"></view>-->
<!--						<view class="rect3"></view>-->
<!--						<view class="rect4"></view>-->
<!--						<view class="rect5"></view>-->
<!--					</view>-->
<!--				</view>-->
				<view :key="index" class="row" v-for="(row,index) in msgList">
					<!-- 系统消息 -->
					<block v-if="row.type=='system'" >
<!--						row.type>>>>>>>>>>{{row.type}}-->
						<view class="system">
							<!-- 文字消息 -->
							<view class="text" v-if="row.chatType== 0">
								{{row.content}}
							</view>
							<!-- 领取红包消息 -->
<!--							<view v-if="row.msg.type=='redEnvelope'" class="red-envelope">-->
<!--								<image src="/static/img/red-envelope-chat.png"></image>-->
<!--								{{row.msg.content.text}}-->
<!--							</view>-->
						</view>
					</block>
					<!-- 用户消息 -->
<!--					{{JSON.stringify(row)}}-->
					<block>
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.sign == userInfoSign">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view class="bubble" v-if="row.chatType== 0">
<!--									<u-loading mode="flower" :show="loadingShow" size="55rpx"></u-loading>-->
									<rich-text :nodes="row.content"></rich-text>
								</view>
								<!-- 语言消息 :class="playMsgid == row.msg.id?'play':''"-->
								<view :class="playMsgid == row.playMsgid?'play':''" @tap="playVoice(row.content,row.playMsgid)" class="bubble voice" v-if="row.chatType==2">
									<view class="length">{{row.voiceLenght}}</view>
									<view class="icon my-voice"></view>
								</view>
								<!-- 图片消息 -->
								<view @tap="showPic(index)" class="bubble img" v-if="row.chatType== 1 ">
<!--									<u-loading mode="flower" :show="loadingShow" size="55rpx"></u-loading>-->
									<image :src="row.content" mode='aspectFill' style="width: 200px;height: 100px; "></image>

								</view>

								<!-- 视频消息 -->
								<view class="bubble img" v-if="row.chatType== 3 " >
<!--									<u-loading mode="flower" :show="loadingShow" size="55rpx"></u-loading>-->
									<video  :src="row.content"   controls  style="width: 200px;height: 100px;"></video>
								</view>

							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="row.avatar"></image>
							</view>
						</view>
						<!-- 别人发出的消息 v-if="item.sign !=userInfoSign" -->
						<view class="other" v-if="row.type == 'orther'">
<!--							{{row}}-->
							<!-- 左-头像 -->
							<view class="left">
								<image :src="row.avatar" @click="toPrivateChat(row.sign,row.name,row.avatar)"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{row.name}}</view> <view class="time">{{row.time}}</view>
								</view>
								<!-- 文字消息 -->
								<view class="bubble" v-if="row.chatType==0">
									<rich-text :nodes="row.content" :selectable="true"></rich-text>
								</view>
								<!-- 语音消息 -->
								<view :class="playMsgid == row.playMsgid?'play':''" @tap="playVoice(row.content,row.playMsgid)" class="bubble voice" v-if="row.chatType==2">
									<view class="icon my-voice"></view>
									<view class="length">{{row.voiceLenght}}</view>
								</view>
								<!-- 图片消息 -->
								<view @tap="showPic(index)" class="bubble img" v-if="row.chatType==1">
									<image :src="row.content" mode='aspectFill' style="width: 200px;height: 100px;"></image>
								</view>
								<!-- 视频消息 -->
								<view class="bubble img" v-if="row.chatType==3">
									<video  :src="row.content"   controls  style="width: 200px;height: 100px;"></video>
								</view>

							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view :class="popupLayerClass" @touchmove.stop.prevent="discard" class="popup-layer">
			<!-- 表情 -->
			<swiper :class="{hidden:hideEmoji}" class="emoji-swiper" duration="150" indicator-dots="true" >
				<swiper-item  :key="pid" v-for="(page,pid) in emojiList">
					<view  :key="index"  @tap="addEmoji(item.id)" v-for="(item,index) in page">
						<image :src="item.src" mode="widthFix"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view :class="{hidden:hideMore}" class="more-layer">
				<view class="list">
					<view @tap="chooseImage" class="box"><view class="icon tupian2"></view></view>
					<view @tap="camera" class="box"><view class="icon paizhao"></view></view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<button @getuserinfo="toAuthor" class="input-button" open-type="getUserInfo"
				v-if="pathType ==1"></button>

		<view :class="popupLayerClass" @touchmove.stop.prevent="discard" class="input-box">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice">
				<view :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice" class="icon"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view @tap="showMore" class="more">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="textbox">
				<view :class="[isVoice?'':'hidden',recording?'recording':'']" @touchcancel="voiceCancel" @touchend="voiceEnd" @touchmove.stop.prevent="voiceIng" @touchstart="voiceBegin" class="voice-mode">{{voiceTis}}</view>
				<view :class="isVoice?'hidden':''"  class="text-mode">
					<view class="box">
						<textarea :show-confirm-bar="false" @focus="textareaFocus" auto-height="true" cursor-spacing="30rpx" v-model="textMsg"/>
					</view>
					<view @tap="chooseEmoji" class="em">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view @tap="showMore" class="more">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view :class="isVoice?'hidden':''" @tap="sendText" class="send">
				<view class="btn">发送</view>
			</view>
		</view>
		<u-toast ref="uploadFail" />
		<!-- 录音UI效果 -->
		<view :class="recording?'':'hidden'" class="record">
			<view :class="willStop?'hidden':''" class="ing"><view class="icon luyin2" ></view></view>
			<view :class="willStop?'':'hidden'" class="cancel"><view class="icon chehui" ></view></view>
			<view :class="willStop?'change':''" class="tis">{{recordTis}}</view>
		</view>
	</view>
</template>
<script src="./chatRoom.js"></script>
<style lang="scss">
	@import "../chatRoom/style";
</style>
