<script>
	import { _ } from 'svelte-i18n';

	export let onClickButton = null;
	export let bg = 'bg-blue';
	export let color = 'white';
	export let className = '';
</script>

<style>
	.btn-icon {
		display: inline-flex;
		height: 40px;
		width: max-content;
	}
</style>

<span
	class="btn-icon br2 ph3 {bg} {color} items-center pointer grow {className}"
	on:click={onClickButton}>
	<svg
		id="Layer_1"
		style="enable-background:new 0 0 30 30;"
		version="1.1"
		viewBox="0 0 30 30"
		width="24"
		height="24"
		fill="white"
		xml:space="preserve"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"><path
			d="M7,22  V4h18v18c0,2.209-1.791,4-4,4"
			style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" />
		<path
			d="M17,22  L17,22H4l0,0c0,2.209,1.791,4,4,4h13C18.791,26,17,24.209,17,22z"
			style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" />
		<line
			style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;"
			x1="15"
			x2="21"
			y1="13"
			y2="13" />
		<line
			style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;"
			x1="11"
			x2="13"
			y1="13"
			y2="13" />
		<line
			style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;"
			x1="15"
			x2="21"
			y1="17"
			y2="17" />
		<line
			style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;"
			x1="11"
			x2="13"
			y1="17"
			y2="17" />
		<line
			style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;"
			x1="15"
			x2="21"
			y1="9"
			y2="9" />
		<line
			style="fill:none;stroke:#ffffff;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;"
			x1="11"
			x2="13"
			y1="9"
			y2="9" />
		<path
			d="M17,22L17,22H4l0,0c0,2.209,1.791,4,4,4h13C18.791,26,17,24.209,17,22z" />
	</svg>
	<span class="ml3 fw6">{$_('order.viewSale')}</span>
</span>
