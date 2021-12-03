<script>
	import { _ } from 'svelte-i18n';
	import PcDropzone from '../form/PcDropzone.svelte';

	export let id;
</script>

<div class="f4 fw6 steel-two tc">
	{$_('image.maximumUpload', { values: { count: 5 } })}
</div>
<div class="mt4 flex items-center justify-center">
	<div class="flex items-center justify-center">
		<div class="mr3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="40"
				viewBox="0 0 40 40">
				<path fill="none" d="M0 0h40v40H0z" />
				<path
					fill="#7e8299"
					d="M34.33 3h-30A3.584 3.584 0 0 0 1 6.332v23.325a3.342 3.342 0 0 0 3.333 3.332h30a3.584 3.584 0 0 0 3.333-3.332V6.332A3.584 3.584 0 0 0 34.33 3zm0 26.524a1 1 0 0 1-.133.133H4.333V6.465l.133-.133H34.18a1 1 0 0 1 .133.133v23.059zm-16.665-5.681L13.5 18.828l-5.833 7.5H31l-7.5-10z"
					transform="translate(.668 2.005)" />
			</svg>
		</div>
		<div>
			<div class="f4 fw6 near-black">{$_('image.highResolution')}</div>
			<div class="mt1 steel-two">{$_('image.highResolutionDesc')}</div>
		</div>
	</div>
	<div class="flex items-center justify-center ml5">
		<div class="mr3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="36"
				height="29.455"
				viewBox="0 0 36 29.455">
				<defs>
					<style>
						.cls-1 {
							fill: #7e8299;
						}
					</style>
				</defs>
				<g id="size">
					<path
						id="Path_45"
						d="M5.984 15.45a1.325 1.325 0 0 0 .278.8 1.636 1.636 0 0 0 1.26.507c.835 0 1.342-.36 1.342-.965a.785.785 0 0 0-.458-.753 7.691 7.691 0 0 0-1.636-.458 4.287 4.287 0 0 1-1.751-.622 2.471 2.471 0 0 1-1.047-2.078c0-1.636 1.342-2.716 3.469-2.716a3.518 3.518 0 0 1 3.011 1.227 3.044 3.044 0 0 1 .556 1.309l-2.308.247c-.131-.7-.524-1-1.342-1s-1.145.36-1.145.851a.753.753 0 0 0 .507.7 5.924 5.924 0 0 0 1.489.344 5.416 5.416 0 0 1 1.767.622 2.438 2.438 0 0 1 1.162 2.209 2.749 2.749 0 0 1-.753 2 3.993 3.993 0 0 1-2.9.851A5.253 5.253 0 0 1 5.067 18a2.585 2.585 0 0 1-1.162-1.391 3.993 3.993 0 0 1-.245-1z"
						class="cls-1"
						transform="translate(.693 .914)" />
					<path
						id="Path_46"
						d="M11.3 9.263a10.129 10.129 0 0 0-.082 1.636v5.809a10.636 10.636 0 0 0 .082 1.636H8.93a10.506 10.506 0 0 0 .082-1.636v-5.842A10.129 10.129 0 0 0 8.93 9.23z"
						class="cls-1"
						transform="translate(4.046 .965)" />
					<path
						id="Path_47"
						d="M18.445 18.364a14.726 14.726 0 0 0-1.636 0H11v-1.915a13.927 13.927 0 0 0 .982-1.1l3.158-3.8.344-.393h-2.52a14.907 14.907 0 0 0-1.636 0V9.2a13.745 13.745 0 0 0 1.636.082h5.3V11.1a12.273 12.273 0 0 0-1.064 1.209l-3.093 3.682-.36.409h3.027a13.255 13.255 0 0 0 1.636 0z"
						class="cls-1"
						transform="translate(5.364 .945)" />
					<path
						id="Path_48"
						d="M22.96 18.4a15.546 15.546 0 0 0-1.784 0H16.12a10.145 10.145 0 0 0 .082-1.636v-5.896a11.455 11.455 0 0 0-.082-1.636h5.089a11.291 11.291 0 0 0 1.636-.082v2.029a14.875 14.875 0 0 0-1.636 0h-2.814v1.636h2.34a12.616 12.616 0 0 0 1.636 0v2.013a11.159 11.159 0 0 0-1.636-.082h-2.34v1.816h2.8a16.527 16.527 0 0 0 1.767 0z"
						class="cls-1"
						transform="translate(8.622 .914)" />
					<path
						id="Path_49"
						d="M33.547 3H4.453A3.436 3.436 0 0 0 1 6.453V29a3.436 3.436 0 0 0 3.453 3.453h29.094A3.436 3.436 0 0 0 37 29V6.453A3.436 3.436 0 0 0 33.547 3zm.18 25.855a.327.327 0 0 1-.327.327H4.6a.327.327 0 0 1-.327-.327V6.6a.327.327 0 0 1 .327-.327h28.8a.327.327 0 0 1 .327.327z"
						class="cls-1"
						transform="translate(-1 -3)" />
				</g>
			</svg>
		</div>
		<div>
			<div class="f4 fw6 near-black">{$_('image.expectedSize')}</div>
			<div class="mt1 steel-two">{$_('image.expectedSizeDesc')}</div>
		</div>
	</div>
</div>
<div class="mt5">
	<PcDropzone {id} />
</div>
