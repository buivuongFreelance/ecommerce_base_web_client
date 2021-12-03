<script>
	import '../../../static/photoswipe/dist/photoswipe.css';
	import '../../../static/photoswipe/dist/default-skin/default-skin.css';
	import PhotoSwipe from '../../../static/photoswipe/dist/photoswipe';
	import PhotoSwipeUI_Default from '../../../static/photoswipe/dist/photoswipe-ui-default.js';
	import { convertArrayPhotoSwipe } from '../../functions';
	import { onDestroy, onMount } from 'svelte';
	import is from 'is_js';

	export let images = [];
	export let onClose;
	export let currentIndex = 0;

	let rootEle;
	let photoSwipe;
	let imagesPhotosSwipe = [];

	onMount(() => {
		if (images.length > 0) {
			imagesPhotosSwipe = convertArrayPhotoSwipe(images, 'url');
			const pswpOptions = {
				index: currentIndex,
			};
			photoSwipe = new PhotoSwipe(
				rootEle,
				PhotoSwipeUI_Default,
				imagesPhotosSwipe,
				pswpOptions
			);
			setTimeout(() => {
				photoSwipe.init();
				photoSwipe.listen('destroy', () => {
					onClose();
				});
			}, 300);
		}
	});

	onDestroy(() => {
		if (photoSwipe) {
			if (is.function(photoSwipe.close)) {
				photoSwipe.close();
			}
		}
	});
</script>

<style>
	:global(.pswp img) {
		max-width: none;
		object-fit: contain;
	}
	:global(.pswp__img--placeholder--blank) {
		display: none !important;
	}
</style>

<!-- Root element of PhotoSwipe. Must have class pswp. -->
<div
	class="pswp"
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
	bind:this={rootEle}>
	<!-- Background of PhotoSwipe.
		         It's a separate element as animating opacity is faster than rgba(). -->
	<div class="pswp__bg" />

	<!-- Slides wrapper with overflow:hidden. -->
	<div class="pswp__scroll-wrap">
		<!-- Container that holds slides.
		            PhotoSwipe keeps only 3 of them in the DOM to save memory.
		            Don't modify these 3 pswp__item elements, data is added later on. -->
		<div class="pswp__container">
			<div class="pswp__item" />
			<div class="pswp__item" />
			<div class="pswp__item" />
		</div>

		<!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
		<div class="pswp__ui pswp__ui--hidden">
			<div class="pswp__top-bar">
				<!--  Controls are self-explanatory. Order can be changed. -->

				<div class="pswp__counter" />

				<button class="pswp__button pswp__button--close" title="Close (Esc)" />

				<button class="pswp__button pswp__button--share" title="Share" />

				<button
					class="pswp__button pswp__button--fs"
					title="Toggle fullscreen" />

				<button class="pswp__button pswp__button--zoom" title="Zoom in/out" />

				<!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
				<!-- element will get class pswp__preloader--active when preloader is running -->
				<div class="pswp__preloader">
					<div class="pswp__preloader__icn">
						<div class="pswp__preloader__cut">
							<div class="pswp__preloader__donut" />
						</div>
					</div>
				</div>
			</div>

			<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
				<div class="pswp__share-tooltip" />
			</div>

			<button
				class="pswp__button pswp__button--arrow--left"
				title="Previous (arrow left)" />

			<button
				class="pswp__button pswp__button--arrow--right"
				title="Next (arrow right)" />

			<div class="pswp__caption">
				<div class="pswp__caption__center" />
			</div>
		</div>
	</div>
</div>
<!-- Root element of PhotoSwipe. Must have class pswp. -->
