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
		version="1.1"
		id="Layer_1"
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
		</style><rect class="st0" width="24" height="24" />
		<path
			class="st1"
			d="M22,19v1l-8,2.5l-7-1.9V22H1V11h8l6.2,2.3c1.1,0.4,1.9,1.5,1.9,2.7h2C20.7,16,22,17.3,22,19z M5,20v-7H3v7H5z
M19.9,18.6C19.7,18.2,19.4,18,19,18h-5.4c-0.5,0-1.1-0.1-1.6-0.3L9.7,17l0.6-1.9l2.4,0.8C13,15.9,15,16,15,16
c0-0.4-0.2-0.7-0.6-0.8L8.6,13H7v5.5l7,1.9L19.9,18.6z"
		/>
		<path
			class="st1"
			d="M18.2,6.6c-1.4-0.4-1.9-0.8-1.9-1.4c0-0.7,0.6-1.2,1.7-1.2c1.1,0,1.5,0.5,1.6,1.3H21c0-1.1-0.7-2.1-2-2.4V1.6
h-1.9V3c-1.2,0.3-2.2,1.1-2.2,2.3c0,1.5,1.2,2.2,3,2.6c1.6,0.4,1.9,0.9,1.9,1.5c0,0.4-0.3,1.1-1.7,1.1c-1.3,0-1.8-0.6-1.9-1.3h-1.4
c0.1,1.4,1.1,2.2,2.3,2.4V13H19v-1.4c1.2-0.2,2.2-1,2.2-2.3C21.2,7.6,19.7,7,18.2,6.6z"
		/>
	</svg>
	<span class="ml3 fw6">{$_('device.viewOffers')}</span>
</span>

<style>
	.btn-icon {
		display: inline-flex;
		height: 40px;
		width: max-content;
	}
</style>
