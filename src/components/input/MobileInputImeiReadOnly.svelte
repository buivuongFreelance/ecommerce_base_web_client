<script>
	import { infoImei } from '../../stores';

	export let label;
</script>

{#if infoImei}
	<div class="flex b--dashed ba b--light-gray bw2 br2 items-center">
		<div
			class="br fw6 light-silver h-50-px width-label ph1rem bg-light-gray flex
				b--dashed b--light-gray items-center justify-center"
		>
			{label}
		</div>
		<input
			autocomplete="off"
			class="input-reset bg-light-gray bn pv3 ph1rem h-50-px fw6 w-100 light-silver"
			type="number"
			name="imei"
			bind:value={$infoImei.imei}
			readonly
		/>
	</div>
{/if}

<style>
	.width-label {
		border-right-width: 2px;
		white-space: nowrap;
	}
	input {
		letter-spacing: 4px;
	}
</style>
