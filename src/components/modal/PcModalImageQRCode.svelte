<script>
	import { _ } from 'svelte-i18n';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import LazyLoad from 'vanilla-lazyload';

	export let onClose, imageScan;

	let containerImage, observer;

	onMount(() => {
		setTimeout(() => {
			if (containerImage) {
				observer = new LazyLoad({
					container: containerImage,
					elements_selector: '.lazy',
				});
				observer.update();
			}
		}, 300);
	});
	onDestroy(() => {
		if (observer) {
			if (typeof observer.destroy === 'function') {
				observer.destroy();
			}
		}
	});
</script>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: calc(100vh - 120px);
		overflow: hidden;
		border-radius: 10px;
		max-width: 360px;
		width: 90%;
	}

	.panel {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
		text-align: center;
		-webkit-overflow-scrolling: touch;
	}
	img {
		display: block;
		width: 100%;
	}
</style>

<div class="fixed z-max wrapper" transition:fade>
	<div class="w-100 bg-white container">
		<div
			class="h-60-px flex items-center justify-between bg-light-gray
				b--pale-grey bb ph4 near-black fw5 f4 panel">
			<div>{$_('label.qrCode')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
			</div>
		</div>
		<div class="pa3 content" bind:this={containerImage}>
			<img
				data-src={imageScan}
				src={'images/loading_content_default.gif'}
				alt="imageScan"
				class="lazy" />
		</div>
	</div>
</div>
