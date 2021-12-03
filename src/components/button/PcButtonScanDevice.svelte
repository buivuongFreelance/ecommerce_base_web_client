<script>
	import { _ } from 'svelte-i18n';

	export let onClickButton = null;
	export let bg = 'bg-dark-blue';
	export let color = 'white';
	export let className = '';
</script>

<span
	class="btn-icon br2 ph3 {bg} {color} items-center pointer grow {className}"
	on:click={onClickButton}
>
	<svg width="24" height="24" fill="#fff" viewBox="0 0 244 387.2"
		><path
			d="M304.8,10.84v0a36.62,36.62,0,0,0-26-10.8H108.32A36.85,36.85,0,0,0,71.6,36.72V350.44a36.87,36.87,0,0,0,36.72,36.76H278.88a36.87,36.87,0,0,0,36.72-36.72V36.76A36.65,36.65,0,0,0,304.8,10.84ZM193.6,362.28h0a9.92,9.92,0,1,1,9.92-9.92A9.92,9.92,0,0,1,193.6,362.28ZM286.44,300a24,24,0,0,1-24,24H124.72a24,24,0,0,1-24-24V66.2a24,24,0,0,1,24-24H262.48a24,24,0,0,1,24,24Z"
			transform="translate(-71.6)"
		/>
		<path
			d="M234,218.74A70.46,70.46,0,1,0,218.74,234l46,46L280,264.73l-46-46ZM177.4,226A48.6,48.6,0,1,1,226,177.4,48.65,48.65,0,0,1,177.4,226Z"
			transform="translate(-71.6)"
		/>
	</svg>
	<span class="ml3 fw6">{$_('device.scanPostDevice')}</span>
</span>

<style>
	.btn-icon {
		display: inline-flex;
		height: 40px;
		width: max-content;
	}
</style>
