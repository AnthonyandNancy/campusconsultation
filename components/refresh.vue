<template>
	<view class="refresh refreshCase" style="width: 100%;height: 100%;">
		<view
			:class="[direct === 2 ? 'loadingDown' : '']"
			:style="{
				height: `${Math.abs(parseInt(move))}px`,
				opacity: `${Math.round(Math.abs(parseInt(move)) / 94)}`
			}"
			class="loading"
		>
			<view class="item flex_row_c hint" v-if="loading"><text>悬停0.1秒即可刷新...</text></view>
			<view class="item flex_row_c loading" v-else>
				<image
					mode=""
					src="data:image/gif;base64,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"
				></image>
				<text>加载中...</text>
			</view>
		</view>
		<view :style="{ transform: `translate3d(0,${move},0)` }" @touchend="touchend" @touchmove="touchmove" @touchstart="touchstart" class="refresh refreshOperator">
			<scroll-view @scroll="scroll" @scrolltolower="scrolltolower" @scrolltoupper="scrolltoupper" scroll-y="true" style="width:100%;height:100%;"><slot /></scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		drop: {
			type: Boolean,
			default: true
		},
		pull: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			move: 0,
			loading: true,
			direct: 1
		};
	},
	mounted() {
		this.scrolltoupper();
	},
	methods: {
		scrolltoupper() {
			if (this.drop) this.direction = 1;
		},
		scrolltolower() {
			if (this.pull) this.direction = 2;
		},
		scroll(ev) {
			let scrollHeightAverage = ev.detail.scrollHeight / 2;
			ev.detail.scrollTop >= scrollHeightAverage ? (this.direction = !this.pull || 2) : (this.direction = !this.drop || 1);
			this.scrollHeightAverage = scrollHeightAverage;
		},
		touchstart(ev) {
			if (this.action) return;
			this.startY = ev.changedTouches[0].clientY;
			this.direct = this.direction;
		},
		touchmove(ev) {
			if (this.action) return;
			let moveY = ev.changedTouches[0].clientY,
				move = (moveY - this.startY) / 3,
				stand = 50,
				publicTime = stand => {
					this.action = true;
					this.move = `${stand}px`;
					clearTimeout(this.loadingTime);
					this.loadingTime = setTimeout(() => {
						this.loading = false;
						this.direct = this.direction;
						this.send(this.direction, stand);
						clearTimeout(this.loadingTime);
					}, 100);
				};
			this.stand = stand;
			switch (this.direction) {
				case 1:
					if (!this.action && move >= stand) return publicTime(stand);
					if (!this.action && move > 0) this.move = `${move}px`;
					break;
				case 2:
					if (!this.action && move <= -stand) return publicTime(-stand);
					if (!this.action && move < 0) this.move = `${move}px`;
					break;
			}
		},
		touchend() {
			clearTimeout(this.loadingTime);
			if (this.loading) this.close();
		},
		send(direction, stand) {
			this.startY = 0;
			switch (direction) {
				case 1:
					this.move = `${stand}px`;
					this.$emit('dropOpen', () => {
						this.close();
					});
					break;
				case 2:
					this.move = `${stand}px`;
					this.$emit('pullOpen', () => {
						this.close();
					});
					break;
			}
		},
		close() {
			this.move = 0;
			setTimeout(() => {
				this.action = false;
				this.loading = true;
			}, 80);
		}
	}
};
</script>
<style lang="stylus">
.flex_row_c
	display flex
	align-items center
	justify-content center
.refreshCase
	position relative
	.loading
		position absolute
		top 0
		left 0
		width 100%
		transition all 0.2s
		z-index 1
		overflow hidden
		.item
			width 100%
			height 100%
		image
			width 16px
			height 16px
		text
			margin-left 4px
			font-size 30rpx
			color #666
	.loadingDown
		top auto
		bottom 0
		transform-origin bottom left
.refresh
	width 100%
	height 100%
	overflow hidden
	z-index 100
	transition all 0.08s
</style>
