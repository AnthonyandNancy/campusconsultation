<template>
	<view class="chatBox">
		<view class="scrollView">

			<scroll-view :scroll-top="scrollTop" :show-scrollbar="false" @scroll="scroll" @scrolltolower="lower" @scrolltoupper="upper"
						 class="scroll-Y" scroll-y="true" style="height:90vh;">
				<view :key="index"  class="chat" v-for="(item,index) in chatList">
						<view class="chatLeft" v-if="item.sign !=userInfoSign">

								<u-row gutter="16" style="margin-top: 10rpx">
									<u-col @click="toPersonalChat" span="1.5">
										<u-avatar :src="item.avatar" class="leftAvater" size="mini"></u-avatar>
									</u-col>

										<div class="leftNameDiv">
											<span class="leftName">{{item.name}}</span>
										</div>


									<u-col offset="1.2" span="9.5">
<!--								<span class="leftContent">-->
<!--&lt;!&ndash;									{{item}}&ndash;&gt;-->
<!--										{{item.type}}-->
<!--&lt;!&ndash;									{{JSON.stringify(item)}}&ndash;&gt;-->
<!--								</span>-->
										<img :src="item.content" class="leftContent" style="width: 100px;height: 100px;" v-if="item.chatType == 1"></img>
										<video  :src="item.content" @error="videoErrorCallback"   class="leftContent" controls style="width: 100px;height: 100px;" v-if="item.chatType == 3"></video>
										<rich-text :nodes="item.content" class="leftContent" v-if="item.chatType == 0"></rich-text>
									</u-col>
								</u-row>


					</view>

					<view class="chatRight"  v-if="item.type =='my'">

							<u-row gutter="20" style="margin-top: 10rpx">
								<u-col @click="toPersonalChat" span="1.5">
									<u-avatar  :src="item.avatar" class="rightAvater" size="mini"></u-avatar>

								</u-col>
								<div class="rightNameDiv">
									<span class="rightName">{{item.name}}</span>
<!--									<rich-text class="rightName" :nodes="item.name"></rich-text>-->
								</div>



<!--									<span class="sendNowTime">20:20</span>-->


								<u-col offset="0.67" span="8">
<!--									offset="0.2"-->
<!--								<span class="rightContent">-->
<!--&lt;!&ndash;									{{item}}&ndash;&gt;-->
<!--										{{item.content}}-->
<!--								</span>-->
									<video  :src="item.content" @error="videoErrorCallback"   class="rightContent" controls style="width: 100px;height: 100px;" v-if="item.chatType == 3"></video>
									<img :src="item.content" class="rightContent" style="width: 100px;height: 100px;" v-if="item.chatType == 1"></img>
									<rich-text :nodes="item.content" class="rightContent" v-if="item.chatType == 0"></rich-text>
								</u-col>

							</u-row>

					</view>
				</view>

			</scroll-view>
		</view>
		<view class="chatFlooter"  v-if="sys ==0">
			<image @click="openPic" src="../../static/images/add.png"></image>
			<image @click="showEmoji" src="../../static/images/emojy.png"></image>
			<view class="textArea">
<!--				<u-input  :type="type" :border="border" height="-3" :auto-height="autoHeight" maxlength="100" :fixed="true"-->
<!--						 placeholder=" " v-model="chatMessage" cursor-spacing="55px" show-confirm-bar="false"/>-->
<!--				<div class="editor" contenteditable="true" v-model="chatMessage"></div>-->
				<textarea  :auto-height="autoHeight" :show-confirm-bar="false" cursor-spacing="10px" maxlength="140" placeholder="请输入" v-model="chatMessage"></textarea>
				<view  class="textarea" v-if="textAreaShow == 1" v-model="chatMessage"></view>
<!--				<textarea  v-model="chatMessage" :show-confirm-bar="false" :auto-height="autoHeight" maxlength="140" cursor-spacing="10px" placeholder="请输入"></textarea>-->
			</view>

<!--			<button @click="sendMessage" class="sendMessage">发送</button>-->
			<u-button @click="sendMessage" class="sendMessage" size="default" type="success">发送</u-button>

		</view>
		<view class="chatFlooter" v-if="sys ==1">
			<image @click="openPic" src="../../static/images/add.png"></image>
			<image @click="showEmoji" src="../../static/images/emojy.png"></image>
			<view class="textArea">
<!--				<u-input :type="type" :border="border" height="60" :auto-height="autoHeight" maxlength="100" :fixed="true"-->
<!--						 placeholder=" " :disabled="chatDisable" cursor-spacing="55px" style="z-index: 1" :show-confirm-bar="false"/>-->
				<textarea  :auto-height="autoHeight" :show-confirm-bar="false" cursor-spacing="10px" maxlength="140" placeholder="请输入" v-if="textAreaShow == 0" v-model="chatMessage"></textarea>
				<view  class="textarea" v-if="textAreaShow == 1" v-model="chatMessage"></view>
			</view>

<!--			<button @click="sendMessage" class="sendMessageAndroid">发送</button>-->
			<u-button @click="sendMessage" class="sendMessageAndroid" size="default" type="success">发送</u-button>

		</view>

		<u-popup :mask="true"  :mask-close-able="true" @close="emojiClose" class="emojiClass" height="250" mode="bottom" style="z-index: 3" v-model="emojiShow">

				<view :key="index" style="height: 30px;width: 30px;float: left;margin-left: 2.5rpx;" v-for="(item,index) in emojiJs">
					<!--									{{item.src}}-->
					<image :src="item.src" @click="chooseEmojiLeft(index)" style="height: 30px;width: 30px;float: left"></image>
				</view>




		</u-popup>

		<u-popup @close="picClose"  height="110" mode="bottom" style="z-index: 3" v-model="pictureShow">
			<div  @click="openAlbum" class="picAndVieClass">
				<image src="../../static/images/picutice.png"></image>
				<div class="centent">照片</div>
			</div>
			<div  @click="openCamera" class="picAndVieClass">
				<image src="../../static/images/shot.png"></image>
				<div class="centent">拍摄</div>
			</div>
		</u-popup>
		<u-toast ref="uToast" />


		<u-modal :content="snedContent" v-model="sendPensonChatMsg"></u-modal>

	</view>
</template>

<script src="./chatPage.js">

</script>

<style lang="scss">
	@import "./chatPage";
</style>
