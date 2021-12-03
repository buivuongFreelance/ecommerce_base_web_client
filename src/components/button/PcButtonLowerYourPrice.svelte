<script>
	import { _ } from 'svelte-i18n';

	export let onClickButton = null;
	export let bg = 'bg-dark-blue';
	export let color = 'white';
</script>

<span
	class="btn-icon br2 ph3 {bg} {color} items-center pointer grow"
	on:click={onClickButton}
>
	<svg
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		x="0px"
		y="0px"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		style="enable-background:new 0 0 24 24;"
		xml:space="preserve"
		><style type="text/css">
			.st0 {
				fill: none;
			}
			.st1 {
				fill: #fff;
			}
		</style><path
			class="st0"
			d="M0,0h24v24H0V0z M0,0h24v24H0V0z M0,0h24v24H0V0z"
		/>
		<g>
			<path class="st1" d="M7.4,20l3-3h-2V4h-2v13h-2L7.4,20z" />
			<path
				class="st1"
				d="M16.6,9.6c-1.4-0.4-1.9-0.8-1.9-1.4c0-0.7,0.6-1.2,1.7-1.2s1.5,0.5,1.6,1.3h1.4c0-1.1-0.7-2.1-2-2.4V4.7h-1.9
V6c-1.2,0.3-2.2,1.1-2.2,2.3c0,1.5,1.2,2.2,3,2.6c1.6,0.4,1.9,0.9,1.9,1.5c0,0.4-0.3,1.1-1.7,1.1c-1.3,0-1.8-0.6-1.9-1.3h-1.4
c0.1,1.4,1.1,2.2,2.3,2.4V16h1.9v-1.4c1.2-0.2,2.2-0.9,2.2-2.2C19.6,10.6,18.1,10,16.6,9.6z"
			/>
		</g>
	</svg>
	<span class="ml3 fw6">{$_('label.lowerPrice')}</span>
</span>

<style>
	.btn-icon {
		display: inline-flex;
		height: 40px;
		width: max-content;
	}
</style>
