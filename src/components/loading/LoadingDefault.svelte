<script>
	export let size = 40;
	export let color = '#FFFFFF';
</script>

<style>
	.spinner {
		width: var(--size);
		height: var(--size);

		position: relative;
	}

	.double-bounce1,
	.double-bounce2 {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: var(--color);
		opacity: 0.6;
		position: absolute;
		top: 0;
		left: 0;

		-webkit-animation: sk-bounce 2s infinite ease-in-out;
		animation: sk-bounce 2s infinite ease-in-out;
	}

	.double-bounce2 {
		-webkit-animation-delay: -1s;
		animation-delay: -1s;
	}

	@-webkit-keyframes sk-bounce {
		0%,
		100% {
			-webkit-transform: scale(0);
		}
		50% {
			-webkit-transform: scale(1);
		}
	}

	@keyframes sk-bounce {
		0%,
		100% {
			transform: scale(0);
			-webkit-transform: scale(0);
		}
		50% {
			transform: scale(1);
			-webkit-transform: scale(1);
		}
	}
</style>

<div class="spinner" style="--size: {size}px; --color: {color}">
	<div class="double-bounce1" />
	<div class="double-bounce2" />
</div>
