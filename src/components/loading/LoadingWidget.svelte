<script>
	export let size = 40;
	export let color = '#FFFFFF';
</script>

<style>
	.lds-ellipsis {
		position: relative;
		width: var(--size);
		height: var(--size);
	}
	.lds-ellipsis div {
		position: absolute;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #fff;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	.lds-ellipsis div:nth-child(1) {
		left: 8px;
		background-color: var(--color);
		animation: lds-ellipsis1 0.6s infinite;
		line-height: var(--size);
	}
	.lds-ellipsis div:nth-child(2) {
		left: 8px;
		background-color: var(--color);
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 32px;
		background-color: var(--color);
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 56px;
		background-color: var(--color);
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
</style>

<div
	class="lds-ellipsis flex items-center"
	style="--size: {size}px; --color: {color}">
	<div />
	<div />
	<div />
	<div />
</div>
