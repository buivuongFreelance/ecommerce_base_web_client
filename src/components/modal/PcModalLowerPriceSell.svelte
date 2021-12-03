<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import PcMoneySliderTwo from '../form/PcMoneySliderTwo.svelte';
	import { auth, currency } from '../../stores';
	import ContentLoader from 'svelte-content-loader';
	import { lowerPrice as apiLowerPrice } from '../../services/device';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { formatFixedPrice } from '../../functions';

	export let onClose;
	export let isLoading = true;
	export let isServerError = false;

	export let item;
	export let onSuccess = null;

	const { session } = stores();
	const { domainDevice } = $session;

	let isLoadingLowerPrice = false;
	let isServerErrorLowerPrice = false;

	let bindValue = 0;
	let onUpdate;

	let priceMax = 2000;
	let priceMin = 0;
	let inputWrapper;
	let oldBindValue;
	let mounted = false;
	let countRefresh = 0;
	let originalValue = 0;
	let errorPrice = null;

	$: {
		if (mounted) {
			if (oldBindValue !== bindValue) {
				inputWrapper.value = bindValue;
				oldBindValue = bindValue;
			}
		}
	}

	onMount(() => {
		if (item) {
			bindValue = item.real_sale_price;
			priceMax = item.real_sale_price;
			originalValue = item.real_sale_price;
		}
		mounted = true;
	});
	const handleUpdate = (value) => {
		onUpdate(value);
	};
	const handleInput = (e) => {
		const { value } = e.target;
		bindValue = isNaN(parseInt(value)) ? 0 : parseFloat(value);
		if (Number(bindValue) > 0 && Number(bindValue) < priceMax) {
			errorPrice = null;
			countRefresh++;
			if (onUpdate) {
				handleUpdate(value);
			}
		} else if (Number(bindValue) == 0) {
			errorPrice = $_('error.salePrice');
			countRefresh++;
			if (onUpdate) {
				handleUpdate(priceMax);
			}
		} else if (Number(bindValue) >= priceMax) {
			errorPrice = $_('error.salePriceSmall', {
				values: { number: priceMax + ' ' + $currency },
			});
			countRefresh++;
			if (onUpdate) {
				handleUpdate(priceMax);
			}
		}
	};

	const lowerPrice = (deviceId, price) => {
		isLoadingLowerPrice = true;
		let token = '';
		if ($auth) token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiLowerPrice(domainDevice, {
				token,
				deviceId,
				price,
			})
				.then((info) => {
					isLoadingLowerPrice = false;
					isServerErrorLowerPrice = false;
					resolve(info);
				})
				.catch((error) => {
					isLoadingLowerPrice = false;
					isServerErrorLowerPrice = true;
					reject(error);
				});
		});
	};
	const handleSubmit = async () => {
		try {
			if (item) {
				if (Number(bindValue) > 0 && Number(bindValue) < priceMax) {
					errorPrice = null;
					await lowerPrice(item.id, bindValue);
					if (onSuccess) {
						onSuccess();
					}
					swal.fire({
						toast: true,
						position: 'top-end',
						icon: 'success',
						title: $_('message.success'),
						showConfirmButton: false,
						timerProgressBar: true,
						timer: 1000,
					});
					onClose();
				} else if (Number(bindValue) == 0) {
					errorPrice = $_('error.salePrice');
				} else if (Number(bindValue) >= priceMax) {
					errorPrice = $_('error.salePriceSmall', {
						values: { number: priceMax + ' ' + $currency },
					});
				} else if (Number(bindValue) === Number(item.real_sale_price)) {
					errorPrice = $_('error.salePrice');
				}
			}
		} catch {
			swal.fire({
				position: 'top',
				icon: 'error',
				title: $_('error.serverErrorTitle'),
				text: $_('error.serverErrorMessage'),
				reverseButtons: true,
			});
			onClose();
		}
	};
</script>

<div class="fixed z-max wrapper" transition:fade>
	<div class="w-100 bg-white container">
		<div
			class="h-60-px flex items-center justify-between bg-light-gray
				b--light-gray ba ph4 fw5 f4 panel"
		>
			<div>{$_('label.lowerPrice')}</div>
			<div class="pointer flex items-center" on:click={onClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					fill="#7e8299"
					width="24"
					><path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
					/></svg
				>
			</div>
		</div>
		<div class="ph4 content pt4 pb4">
			{#if isServerError}
				<p class="red f4">{$_('error.serverErrorMessage')}</p>
			{:else if isLoading}
				<ContentLoader
					uniqueKey="filterDevice"
					primaryColor="#e4e6ef"
					secondaryColor="#f8f8f8"
					width="460"
					height="300"
				>
					<rect x="0" y="0" rx="3" ry="3" width="100%" height="300" />
				</ContentLoader>
			{:else}
				<div class="container-slider">
					{#if mounted}
						<PcMoneySliderTwo bind:bindValue {countRefresh} />
					{/if}
				</div>

				<div class="ml4 mr4 mt4">
					<div class="mb3">{$_('device.sellingPrice')}:</div>
					<div class="container-inputNumber flex">
						<input
							type="number"
							id="inputNumber"
							class="inputNumber pa4 b f2 bn w-100 flex-1"
							on:input={(e) => handleInput(e)}
							bind:this={inputWrapper}
						/>
						<label
							for="inputNumber"
							class="pointer bg-light-gray ph5 bl b--light-gray flex items-center justify-center f2 b"
							>{$currency}</label
						>
					</div>
					{#if errorPrice !== null}
						<div class="red mt3">{errorPrice}</div>
					{/if}
				</div>

				<div class="mt3 mb5 mr4 ml4 flex justify-between">
					<div />
					<p class="tr dark-blue mt3">
						{$_('message.originalPrice')}:
						{originalValue}
						{$currency}
					</p>
				</div>

				<div class="mh4 flex justify-end">
					{#if isLoadingLowerPrice}
						<button
							type="button"
							disabled
							class="btn-submit w-50 h-50-px bg-dark-blue white bn br1 grow pointer fw6 ttu tc dif items-center justify-center">
							<LoadingDefault color="#ccc" size="30" />
						</button>
						<!-- {:else if errorPrice !== null}
						<button
							type="button"
							disabled
							class="btn-submit btn-disabled w-50 h-50-px bg-dark-blue white bn br1 grow pointer fw6 ttu">
							{$_('cart.confirm')}
						</button> -->
					{:else}
						<button
							on:click={handleSubmit}
							type="button"
							class="btn-submit w-50 h-50-px bg-dark-blue white bn br1 grow pointer fw6 ttu"
							>{$_('cart.confirm')}</button
						>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		margin: 30px auto 0;
		overflow: hidden;
		border-radius: 10px;
		width: 600px;
	}
	.panel {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.content {
		overflow: auto;
	}
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		line-height: 1;
		width: 120px;
	}
	.flex-1 {
		flex: 1;
	}
	.container-slider {
		padding: 40px 55px;
	}
	.dif {
		display: inline-flex;
	}
	/* .btn-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	} */
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
