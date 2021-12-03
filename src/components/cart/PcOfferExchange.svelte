<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { displayCurrency } from '../../functions';
	import { currency, auth } from '../../stores';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalSelectDeviceOffer from './PcModalSelectDeviceOffer.svelte';
	import config from '../../config';
	import { onDestroy, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import { listAccountDevicesExclude as apiListAccountDevicesExclude } from '../../services/device';
	import PcExchangeInfo from './PcExchangeInfo.svelte';

	const { session } = stores();
	const { domainDevice } = $session;

	export let bindValue;
	export let selectedExchangeDevices = [];
	export let detail = null;
	export let typeExchange;
	export let cart;

	let isServerError = false;
	let listDeviceMatch = [];

	let oldSelectedExchangeDevices = [];
	let isLoading = false;
	let listServerExchangeDeviceRemoved = [];
	let isOpenModal = false;
	let inputWrapper;
	let oldBindValue;
	let mounted = false;
	let oldTypeExchange = null;
	let originalValue = 0;
	let exchangeIds = [];

	$: {
		if (isOpenModal) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
		if (mounted) {
			if (inputWrapper) {
				if (oldTypeExchange !== typeExchange) {
					oldTypeExchange = typeExchange;
					if (typeExchange === config.exchangeType.offer) {
						if (originalValue < 0) {
							bindValue = Math.abs(originalValue);
						} else {
							bindValue = 0;
						}
						inputWrapper.value = Math.abs(bindValue);
						setTimeout(() => {
							inputWrapper.focus();
						}, 300);
					} else if (typeExchange === config.exchangeType.request) {
						if (originalValue >= 0) {
							bindValue = originalValue;
						} else {
							bindValue = 0;
						}
						inputWrapper.value = Math.abs(bindValue);
						setTimeout(() => {
							inputWrapper.focus();
						}, 300);
					} else {
						bindValue = 0;
						inputWrapper.value = 0;
					}
				}
				if (oldBindValue !== bindValue) {
					inputWrapper.value = Math.abs(bindValue);
					oldBindValue = bindValue;
				}
			}
		}
	}
	const listDevices = () => {
		return new Promise((resolve, reject) => {
			isLoading = true;
			let token = '';
			if ($auth) {
				token = $auth.accessToken;
			}
			const exchangeIds = selectedExchangeDevices.map(
				(selectedExchangedDevice) => selectedExchangedDevice.id
			);

			apiListAccountDevicesExclude(domainDevice, {
				token,
				limit: 1000,
				filter: { deviceName: cart.exchange_model.model_name },
				offset: 0,
				exchangeIds: [],
			})
				.then((obj) => {
					isServerError = false;
					isLoading = false;
					resolve(obj.list);
				})
				.catch(() => {
					isServerError = true;
					isLoading = false;
					reject();
				});
		});
	};
	const initExchange = () => {
		if (listDeviceMatch.length > 0) {
			listDeviceMatch.sort((a, b) => {
				const capacityCart = Number(
					cart.exchange_model.capacity_name.split(' ')[0]
				);
				const colorCart = cart.exchange_model.color_name;
				const capacityA = Number(a.capacity);
				const capacityB = Number(b.capacity);
				const colorA = a.color;
				const colorB = b.color;

				const capacityRemainA = Math.abs(capacityCart - capacityA);
				const capacityRemainB = Math.abs(capacityCart - capacityB);

				if (capacityA === capacityCart) {
					return -1;
				}
				if (capacityB === capacityCart) {
					return 1;
				}
				if (colorA === colorCart) {
					return -1;
				}
				if (colorB === colorCart) {
					return 1;
				}
				if (capacityRemainA < capacityRemainB) {
					return -1;
				}
				if (capacityRemainA > capacityRemainB) {
					return 1;
				}
				return 0;
			});
		}
		if (listDeviceMatch.length === 1) {
			if (cart.real_exchange_price < 0) {
				typeExchange = config.exchangeType.request;
				originalValue = Math.abs(Number(cart.real_exchange_price));
			} else {
				typeExchange = config.exchangeType.offer;
				originalValue = Number(-cart.real_exchange_price);
			}
			setTimeout(() => {
				bindValue = Math.abs(cart.real_exchange_price);
				selectedExchangeDevices.push(listDeviceMatch[0]);
				selectedExchangeDevices = selectedExchangeDevices;
				exchangeIds.push(listDeviceMatch[0].id);
			}, 400);
		} else if (listDeviceMatch.length > 1) {
			if (cart.real_exchange_price < 0) {
				typeExchange = config.exchangeType.request;
				originalValue = Math.abs(Number(cart.real_exchange_price));
			} else {
				typeExchange = config.exchangeType.offer;
				originalValue = Number(-cart.real_exchange_price);
			}
			setTimeout(() => {
				bindValue = Math.abs(cart.real_exchange_price);
				selectedExchangeDevices.push(listDeviceMatch[0]);
				selectedExchangeDevices = selectedExchangeDevices;
				exchangeIds.push(listDeviceMatch[0].id);
			}, 400);
		} else {
			typeExchange = config.exchangeType.offer;
		}
	};
	onMount(async () => {
		oldSelectedExchangeDevices = Object.assign([], selectedExchangeDevices);
		if (detail) {
			originalValue = detail.buyer_exchange_price;
			inputWrapper.value = Math.abs(bindValue);
		}
		mounted = true;
		if (cart.cart_type === config.exchange) {
			listDeviceMatch = await listDevices();
			if (!detail) {
				initExchange();
			} else {
				if (detail.type === config.sell) {
					initExchange();
				} else {
					if (selectedExchangeDevices.length === 0) {
						initExchange();
					}
				}
			}
		} else {
			if (!detail) {
				typeExchange = config.exchangeType.offer;
			} else {
				if (detail.type === config.sell) {
					typeExchange = config.exchangeType.offer;
				}
			}
		}
		selectedExchangeDevices;
	});

	onDestroy(() => {
		document.body.classList.remove('noscroll');
	});
	const onSelectDeviceOffer = () => {
		isOpenModal = true;
	};

	const handleSelectItem = (item) => {
		if (item.server) {
			const index = listServerExchangeDeviceRemoved
				.map((e) => e.id)
				.indexOf(item.id);
			if (index !== -1) {
				listServerExchangeDeviceRemoved.splice(index, 1);
				listServerExchangeDeviceRemoved = listServerExchangeDeviceRemoved;
			}
		}
		handleCloseModal();
		//isUpdateExchangeDevices = true;
		if (listDeviceMatch.length > 1) {
			selectedExchangeDevices = [];
		}
		selectedExchangeDevices.push(item);
		selectedExchangeDevices = selectedExchangeDevices;
	};

	const handleCloseModal = () => {
		isOpenModal = false;
	};

	const checkExchangeDevicesExists = (item) => {
		const index = oldSelectedExchangeDevices.map((e) => e.id).indexOf(item.id);
		if (index !== -1) {
			return true;
		}
		return false;
	};

	const handleDelete = (item) => {
		if (checkExchangeDevicesExists(item)) {
			item.server = true;
			listServerExchangeDeviceRemoved.push(item);
			listServerExchangeDeviceRemoved = listServerExchangeDeviceRemoved;
		}
		const index = selectedExchangeDevices.map((e) => e.id).indexOf(item.id);
		if (index !== -1) {
			selectedExchangeDevices.splice(index, 1);
			selectedExchangeDevices = selectedExchangeDevices;
		}
	};

	const handleInput = (e) => {
		const { value } = e.target;
		if (value === 0) {
			bindValue = 0;
		} else {
			bindValue = Math.abs(value);
		}
	};
</script>

<style>
	.content {
		width: 100%;
	}
	.image-empty {
		width: 90px;
		height: 120px;
		border-radius: 10px;
		border: 1px dashed #3699ff;
		border-width: 4;
	}
	.image-device {
		border-radius: 10px;
		width: 78px;
		height: 108px;
		padding: 5px;
		object-fit: cover;
	}
	.name {
		width: 110px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.close {
		position: absolute;
		top: -11px;
		right: 3px;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		cursor: pointer;
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
	}

	.inputNumber {
		height: 50px;
		width: 160px;
	}
	.inputNumber:focus {
		outline: none;
	}
	.radio {
		display: inline-flex;
		align-items: center;
	}
	.radio input {
		display: none;
	}
	.radio .box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid #7e8299;
		box-sizing: border-box;
	}
	.radio .box:after {
		content: '';
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #2f3a97;
		opacity: 0;
	}
	.radio > input:checked + .box {
		border-color: #2f3a97;
	}
	.radio > input:checked + .box:after {
		opacity: 1;
	}
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>

{#if isOpenModal}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={handleCloseModal} />
		<PcModalSelectDeviceOffer
			listAdded={listServerExchangeDeviceRemoved}
			selectedExchangedDevices={selectedExchangeDevices}
			onClose={handleCloseModal}
			filterModel={cart.cart_type === config.exchange && listDeviceMatch.length > 1 ? cart.exchange_model.model_name : ''}
			onSelectItem={handleSelectItem} />
	</Portal>
{/if}

<div class="w-100 flex items-center justify-center pb3">
	<div class="content">
		{#if cart}
			<div>
				<div class="flex">
					<div>
						<img
							src={cart.url}
							width={cart.cart_type == config.exchange ? 60 : 50}
							height={cart.cart_type == config.exchange ? 60 : 50}
							alt={cart.model}
							class="br3" />
					</div>
					<div class="ml3">
						<div class="near-black">
							{cart.model}

							{cart.capacity}
							GB
							{cart.color}
						</div>
						{#if cart.cart_type == config.exchange}
							<PcExchangeInfo item={cart} />
						{:else}
							<div class="b">
								{displayCurrency(cart.real_sale_price, $currency)}
								{$currency}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
		<div class="mt4">
			{#if listDeviceMatch.length === 1}
				<div class="i mb4">
					{$_('proposal.oneDeviceMatch')}<b>{cart.exchange_model.model_name}</b>.
				</div>
			{:else if listDeviceMatch.length > 1}
				<div class="i mb4">
					{$_('proposal.pleaseAddDeviceMatch', {
						values: { number: listDeviceMatch.length },
					})}
					<b>{cart.exchange_model.model_name}</b>.
					{$_('proposal.pleaseChooseBelow')}
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href="javascript:void(0);" on:click={onSelectDeviceOffer}>clicking
						here</a>
				</div>
			{:else}
				<div class="i mb4">{$_('proposal.pleaseAddDevice')}</div>
			{/if}
			<div class="w-100 flex justify-center mt3">
				{#if isLoading}
					<ContentLoader width="500" uniqueKey="slideshow">
						<rect x="0" y="0" rx="5" ry="5" width="500" height="195" />
					</ContentLoader>
				{:else}
					{#each selectedExchangeDevices as exchangeDevice}
						<div
							on:click={() => (listDeviceMatch.length > 1 ? onSelectDeviceOffer() : null)}
							class="flex flex-column items-center justify-center pointer grow mr4 relative">
							{#if listDeviceMatch.length === 0}
								{#if detail && cart.cart_type === config.exchange}
									{#if detail.status !== config.proposal.sellerAccept}
										<div
											class="close bg-gray flex items-center justify-center"
											on:click={() => handleDelete(exchangeDevice)}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="20px"
												viewBox="0 0 24 24"
												fill="#ffffff"
												width="24px"><path d="M0 0h24v24H0V0z" fill="none" />
												<path
													d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
										</div>
									{/if}
								{:else if cart.cart_type === config.exchange}
									{#if listDeviceMatch.length === 0}
										<div
											class="close bg-gray flex items-center justify-center"
											on:click={() => handleDelete(exchangeDevice)}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="20px"
												viewBox="0 0 24 24"
												fill="#ffffff"
												width="24px"><path d="M0 0h24v24H0V0z" fill="none" />
												<path
													d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
										</div>
									{/if}
								{:else}
									<div
										class="close bg-gray flex items-center justify-center"
										on:click={() => handleDelete(exchangeDevice)}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="20px"
											viewBox="0 0 24 24"
											fill="#ffffff"
											width="24px"><path d="M0 0h24v24H0V0z" fill="none" />
											<path
												d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
									</div>
								{/if}
							{/if}
							<img
								src={exchangeDevice.url ? exchangeDevice.url : exchangeDevice.model_url}
								alt=""
								class="image-device ba b--light-gray" />
							<div class="f7 mt1 name">
								{exchangeDevice.model}

								{exchangeDevice.capacity}
								GB
								{exchangeDevice.color}
							</div>
						</div>
					{/each}
				{/if}
				{#if listDeviceMatch.length === 0}
					{#if detail && cart.cart_type === config.exchange}
						{#if detail.status !== config.proposal.sellerAccept}
							{#if selectedExchangeDevices.length < 3}
								<div
									on:click={onSelectDeviceOffer}
									class="image-empty flex items-center justify-center pointer grow
								mr3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="#3699ff"
										width="30"><path d="M0 0h24v24H0z" fill="none" />
										<path
											d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
									</svg>
								</div>
							{/if}
						{/if}
					{:else if selectedExchangeDevices.length < 3}
						{#if listDeviceMatch.length !== 1}
							<div
								on:click={onSelectDeviceOffer}
								class="image-empty flex items-center justify-center pointer grow mr3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="#3699ff"
									width="30"><path d="M0 0h24v24H0z" fill="none" />
									<path
										d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
								</svg>
							</div>
						{/if}
					{/if}
				{/if}
			</div>
			<div class="mt4">
				<div class="i">{$_('offer.questionOfferRequest')}</div>
				<div class="flex mt3 justify-between items-center">
					<div>
						<div class="mt3">
							<label class="light-silver radio pointer">
								<input
									type="radio"
									value={config.exchangeType.offer}
									bind:group={typeExchange} />
								<span class="box" />
								<span class="label ml3 ttc">{$_('device.youPayPrice')}</span>
							</label>
						</div>
						<div class="mt3">
							<label class="light-silver radio pointer">
								<input
									type="radio"
									value={config.exchangeType.request}
									bind:group={typeExchange} />
								<span class="box" />
								<span class="label ml3 ttc">{$_('device.youTakePrice')}</span>
							</label>
						</div>
					</div>
					<div>
						<div class="flex">
							<input
								type="number"
								id="inputNumber"
								class="inputNumber b ph3 f3 ba b--light-gray br2 near-black"
								on:input={(e) => handleInput(e)}
								bind:this={inputWrapper} />
							<label
								for="inputNumber"
								class="flex items-center justify-center f3 ml3 b">{$currency}</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
