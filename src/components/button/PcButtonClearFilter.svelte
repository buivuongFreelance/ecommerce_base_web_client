<script>
	import { _ } from 'svelte-i18n';

	export let onClickButton = null;
	export let type = 'button';
	export let className = 'bg-silver mid-gray';
</script>

<button
	{type}
	class="btn-icon br2 ph4 {className} items-center pointer grow"
	on:click={onClickButton}
>
	<svg
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		x="0px"
		y="0px"
		width="24"
		height="24"
		fill="#3F4254"
		viewBox="0 0 24 24"
		style="enable-background:new 0 0 24 24;"
		xml:space="preserve"
		><style type="text/css">
			.st0 {
				fill: none;
			}
		</style><g>
			<path class="st0" d="M24,0H0 M24,24H0" />
			<path
				d="M19,4H8.2l2,2H17l-3,3.8l1.4,1.4c1.3-1.6,3.1-4,4.3-5.6C20.2,5,19.8,4,19,4z M13.7,12.3l-1-1l-0.8,1L7,6h0.4l-2-2H5
		C4.2,4,3.7,5,4.2,5.6C6.3,8.2,10,13,10,13v6c0,0.5,0.5,1,1,1h2c0.5,0,1-0.5,1-1v-6c0,0,0.1-0.1,0.2-0.2L13.7,12.3z"
			/>
			<path
				class="st0"
				d="M7.4,6H7l5,6.3l0.8-1L7.4,6z M10.2,6L14,9.8L17,6H10.2z M7,6l5,6.3l0.8-1L7.4,6H7z M19,4H8.2l2,2l5.2,5.2
		c1.3-1.6,3.1-4,4.3-5.6C20.2,5,19.8,4,19,4z M5.4,4H5C4.2,4,3.7,5,4.2,5.6C6.3,8.2,10,13,10,13v6c0,0.5,0.5,1,1,1h2
		c0.5,0,1-0.5,1-1v-6c0,0,0.1-0.1,0.2-0.2l-0.4-0.4L5.4,4z M7.4,6H7l5,6.3l0.8-1L7.4,6z"
			/>
		</g>
		<g>
			<path d="M3.5,2.1L2.1,3.5l10.4,10.4l1.4,1.4l6.6,6.6l1.4-1.4L3.5,2.1z" />
		</g>
	</svg>

	<span class="ml3 fw6">{$_('device.clearFilter')}</span>
</button>

<style>
	.btn-icon {
		border: none;
		display: inline-flex;
		height: 40px;
		width: max-content;
	}
</style>
