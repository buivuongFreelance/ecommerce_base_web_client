<script>
	import { infoImei } from '../../stores';

	export let label;
</script>

<style>
	.width-label {
		width: 200px;
		border-right-width: 2px;
	}
	.w-input {
		width: calc(100% - 125px);
	}
</style>

{#if infoImei}
	<div class="flex b--dashed ba b--light-gray bw2 br2 items-center">
		<div
			class="br f4 fw6 light-silver h-60-px width-label bg-light-gray flex
				b--dashed b--light-gray items-center justify-center">
			{label}
		</div>
		<input
			autocomplete="off"
			class="input-reset bg-light-gray bn pv3 ph4 h-60-px fw6 f4 light-silver
				w-input"
			type="number"
			name="imei"
			bind:value={$infoImei.imei}
			readonly />
	</div>
{/if}
