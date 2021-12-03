<script>
	import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import { displayMoneyNoCurrency } from '../../functions';
	import { currency } from '../../stores';
	import PcMoneySlider from '../form/PcMoneySlider.svelte';
	import IconHelp from '../icon/IconHelp.svelte';

	export let bindValue;
	export let error;
	export let onUpdate;

	let inputWrapper;
	let oldBindValue;
	let mounted = false;
	let countRefresh = 0;

	$: {
		if (mounted) {
			if (oldBindValue !== bindValue) {
				inputWrapper.value = bindValue;
				oldBindValue = bindValue;
			}
		}
	}

	onMount(() => {
		mounted = true;
	});
	const handleValidateSell = (value) => {
		onUpdate(value);
	};

	const handleInput = (e) => {
		const { value } = e.target;
		if (Number(value) <= 2000) {
			bindValue = isNaN(parseInt(value)) ? 0 : parseFloat(value);
			countRefresh++;
			if (onUpdate) {
				handleValidateSell(value);
			}
		} else {
			inputWrapper.value = oldBindValue;
		}
	};
</script>

<div class="mt1rem">
	<div class="flex items-center">
		<div class="fw6 mr1" class:red={error} class:light-silver={!error}>
			{$_('device.descSellDevice')}
		</div>
		<IconHelp size="15" />
	</div>
	<div class="width-price mt3">
		<div class="">
			<div
				class="container-inputNumber input-money near-black b--pale-grey ba br10 flex flex-1"
				class:b--red={error}
				class:b--pale-grey={!error}
				class:red={error}
				class:dark-blue={!error}
			>
				<input
					type="number"
					id="inputNumber"
					class="inputNumber b f2 tr bn w-100 mr3 flex-1 near-black"
					on:input={(e) => handleInput(e)}
					bind:this={inputWrapper}
				/>
				<label
					for="inputNumber"
					class="pointer bg-light-gray ph5 bl b--light-gray flex items-center justify-center f3 b"
				>
					{$currency}
				</label>
			</div>
		</div>
	</div>
</div>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		width: 120px;
	}
	.input-money input {
		line-height: 1;
	}
	.flex-1 {
		flex: 1;
	}

	.inputNumber {
		height: 80px;
	}
	.inputNumber:focus {
		outline: none;
	}
	.container-inputNumber {
		border: 1px solid #e4e6ef;
		border-radius: 4px;
		overflow: hidden;
	}
	.container-inputNumber:focus-within {
		border-color: #b5b5c3;
	}
</style>
