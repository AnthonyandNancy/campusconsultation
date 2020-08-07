<template>
	<div class="dropdown-menu">
		<slot></slot>
	</div>
</template>

<script>
	export default {
			data() {
			return {
			}
		},
		mounted() {
			this.$on('close', this.closeDropdown)
		},
		methods: {
			closeDropdown() {
				this.$children.forEach(item =>{
					item.close();
				})
			}
		}
	}
</script>

<style lang="scss">
	.dropdown-menu {
		display: flex;
		/*overflow: auto;*/
		white-space: nowrap;
		justify-content: center;
		align-items: center;
		border-bottom: 1rpx solid rgba(0,0,0,0.2);
	}
	dropdown-item {
		flex: 1;
	}
</style>
