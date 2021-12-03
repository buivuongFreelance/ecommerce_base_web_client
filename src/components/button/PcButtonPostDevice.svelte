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
	<svg
		id="Layer_1"
		data-name="Layer 1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 13.99 22"
		width="24"
		height="24"
		fill="white"
		><path
			d="M17,1H7A2,2,0,0,0,5,3V21A2,2,0,0,0,7,23H17A2,2,0,0,0,19,21V3A2,2,0,0,0,17,1Zm0,18H7V5H17Z"
			transform="translate(-5.01 -1)"
		/><path
			d="M9.6,9h2.9a3.26,3.26,0,0,1,1.2.2,1.34,1.34,0,0,1,.6.7,3.75,3.75,0,0,1,.1,1.1,3.75,3.75,0,0,1-.1,1.1,1.28,1.28,0,0,1-.5.7,2.27,2.27,0,0,1-1.3.3H11.1V15H9.6Zm2.3,2.9a1.48,1.48,0,0,0,.7-.1.77.77,0,0,0,.3-.2,4.33,4.33,0,0,0,.1-.5c0-.3,0-.4-.1-.5s-.1-.2-.3-.2a5.64,5.64,0,0,0-.7-.1h-.8v1.6Z"
			transform="translate(-5.01 -1)"
		/>
	</svg>
	<span class="ml3 fw6">{$_('device.postDevice')}</span>
</span>

<style>
	.btn-icon {
		display: inline-flex;
		height: 40px;
		width: max-content;
	}
</style>
