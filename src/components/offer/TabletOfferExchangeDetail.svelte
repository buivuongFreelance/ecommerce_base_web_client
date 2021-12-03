<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '@sapper/app';
	import config from '../../config';
	import {
		displayExchangeStr,
		displayMoneyNoCurrency,
		displayMoneyNoCurrencyNoExchange,
	} from '../../functions';
	import { currency } from '../../stores';
	import PcMoneyExchangeSliderTwo from '../form/PcMoneyExchangeSliderTwo.svelte';
	import PcPhysicalCondition from '../input/PcPhysicalCondition.svelte';

	import PcTagDevice from '../device/PcTagDevice.svelte';

	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalImageScan from '../modal/PcModalImageScan.svelte';
	import PcMoneySliderTwo from '../form/PcMoneySliderTwo.svelte';

	export let bindValue;

	export let selectedExchangeDevices = [];
	export let detail = null;
	export let handleReset = null;
	export let onUpdate = null;
	export let isUpdateExchangeDevices = false;

	export let updateNotReply;

	let isOpenImageScan = false;
	let oldValue = 0;

	$: {
		if (isOpenImageScan) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
		if (oldValue !== bindValue) {
			if (bindValue === 0 && selectedExchangeDevices.length === 0) {
				updateNotReply();
			}
			oldValue = bindValue;
		}
	}

	const handleUpdate = (value) => {
		onUpdate(value);
	};
	const handleDelete = (item) => {
		isUpdateExchangeDevices = true;
		const index = selectedExchangeDevices.map((e) => e.id).indexOf(item.id);
		if (index !== -1) {
			selectedExchangeDevices.splice(index, 1);
			setTimeout(() => {
				selectedExchangeDevices = selectedExchangeDevices;
			}, 200);
		}
		if (selectedExchangeDevices.length === 0) {
			isUpdateExchangeDevices = false;
			bindValue = 0;
		}
	};

	const gotoDetail = (item) => {
		if (item.status === config.device.posted) {
			goto('device/' + item.id);
		}
	};
</script>

<style>
	.panel {
		height: 50px;
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
	}
	.border-white-three {
		border-color: #dfdfdf;
	}
	.content {
		max-width: 800px;
	}
	.slider {
		width: 500px;
	}
	.image-device {
		border-radius: 3px;
		width: 90px;
		height: 120px;
		padding: 5px;
		object-fit: cover;
	}

	.money-exchange {
		margin-top: 80px;
		width: 500px;
	}
	.close {
		position: absolute;
		top: 10px;
		right: 0;
		cursor: pointer;
	}
</style>

<div
	class="panel w-100 bg-dark-blue br--top flex items-center justify-between pl3 pr3">
	<div class="white fw6">{$_('cart.offerDevices')}</div>
	<slot name="header" />
</div>

{#if detail}
	<div
		class="w-100 flex items-center justify-center border-white-three ba br2
			br--bottom pv5">
		<div class="content">
			<div class="flex justify-between">
				<div class="f4 fw6 mt3 steel-two i tc">
					{#if detail.status === config.proposal.sellerAccept}
						{$_('proposal.descSellerAccept')}
					{:else if detail.status === config.proposal.buyerAccept}
						{$_('proposal.descRecipientAccept')}
					{:else}{$_('cart.offerMoneyDescSeller')}{/if}
				</div>
				{#if detail.status !== config.proposal.sellerAccept && detail.status !== config.proposal.sellerReply}
					<button
						type="button"
						on:click={handleReset}
						class="link bg-light-gray br1 ba fw6 h-50-px near-black b--pale-grey pointer flex items-center justify-center dim ph6 ttu">{$_('message.reset')}</button>
				{/if}
			</div>
			<div class="mv4">
				{#if selectedExchangeDevices}
					{#if selectedExchangeDevices.length > 0}
						{#each selectedExchangeDevices as exchangeDevice}
							<div
								class="flex flex-column items-center justify-center
								relative bt b--light-gray pt3 mt3">
								<div
									class="pointer close bg-light-gray br1 ba f7 b--light-gray near-black ph3 h-30-px ttu fw6 flex items-center justify-center grow"
									on:click={() => handleDelete(exchangeDevice)}>
									{$_('message.remove')}
								</div>
								<div class="w-100 flex">
									<div class="img-container mr4">
										<img
											src={exchangeDevice.url ? exchangeDevice.url : ''}
											alt={exchangeDevice.model}
											on:click={() => gotoDetail(exchangeDevice)}
											class:pointer={exchangeDevice.status === config.device.posted}
											class="image-device ba b--light-gray" />
									</div>
									<div class="device-content flex-1">
										{#if exchangeDevice.status === config.device.waitingForScan}
											<div class="tr i yellow fw6 mb3">
												{$_('message.deviceIsNotScanned')}
											</div>
										{/if}

										<h4
											class="mb3 ttc"
											class:pointer={exchangeDevice.status === config.device.posted}
											class:dark-blue={exchangeDevice.status === config.device.posted}
											on:click={() => gotoDetail(exchangeDevice)}>
											{exchangeDevice.model}
											-
											{exchangeDevice.capacity}
											{$_('label.GB')}
											-
											{exchangeDevice.color}
										</h4>

										<div class="gray mb3">
											{$_('device.brand')}
											<span class="mh1">:</span>
											{exchangeDevice.brand_name}
										</div>

										<div class="mb3">
											{$_('device.physicalGrading')}
											<span class="mh1">:</span>
											<PcPhysicalCondition
												grade={exchangeDevice.physical_grading} />
										</div>
										<div class="mb3">
											<span>
												{$_('proposal.status')}
												<span class="mh1">:</span>
												<PcTagDevice status={exchangeDevice.status} />
											</span>
										</div>

										{#if exchangeDevice.status === config.device.posted}
											<div class="flex">
												<div
													on:click={() => (isOpenImageScan = true)}
													class="btn btn-icon-only w-50-px h-50-px br1 flex justify-center items-center pointer grow ba b--dark-blue dark-blue bg-white">
													<svg
														width="24"
														height="24"
														fill="#2F3A97"
														x="0px"
														y="0px"
														viewBox="0 0 192.287 192.287">
														<g>
															<path
																d="M122.901,0H19.699v192.287h152.889v-142.6L122.901,0z M146.981,45.299h-19.686V25.612L146.981,45.299z M34.699,177.287V15 h77.596v37.799c0,4.142,3.357,7.5,7.5,7.5h37.793v116.988H34.699z" />
															<rect
																x="53.141"
																y="149.004"
																width="86.006"
																height="10" />
															<rect
																x="53.141"
																y="55.101"
																width="51.058"
																height="10" />
															<polygon
																points="121.248,86.935 126.79,86.935 105.371,108.353 88.623,91.605 51.597,128.634 58.667,135.706 88.623,105.748  105.371,122.495 133.861,94.005 133.861,99.535 143.861,99.535 143.861,76.935 121.248,76.935 	" />
															<rect
																x="53.141"
																y="33.283"
																width="51.058"
																height="10" />
														</g>
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
														<g />
													</svg>
												</div>
												{#if isOpenImageScan}
													<Portal target={document.getElementById('portal')}>
														<DimmerModal
															type="modal"
															onClick={() => (isOpenImageScan = false)} />
														<PcModalImageScan
															onClose={() => (isOpenImageScan = false)}
															imageScan={exchangeDevice.dingtoi_scan_image} />
													</Portal>
												{/if}
											</div>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					{/if}
				{/if}
			</div>
			{#if selectedExchangeDevices.length > 0}
				<div class="flex flex-column items-center justify-center">
					{#if detail.status !== config.proposal.sellerAccept && detail.status !== config.proposal.sellerReply}
						<div class="mb6 money-exchange money-slider-exchange-pc">
							<PcMoneyExchangeSliderTwo
								bind:bindValue
								onUpdate={handleUpdate} />
						</div>
					{/if}
					<div
						class="mt4 b--pale-grey ba br10 pv4 flex items-center justify-center
							slider">
						<div class="flex">
							<div>
								<div class="f4 fw6 near-black">
									{$_('device.exchangePrice')}
									({$currency}):
								</div>
								<div class="steel-two tr">
									{$_(displayExchangeStr(bindValue))}
								</div>
							</div>
							<div class="ml5 b f2 near-black">
								{displayMoneyNoCurrency(bindValue)}
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="flex flex-column items-center justify-center">
					{#if detail.status !== config.proposal.sellerAccept && detail.status !== config.proposal.sellerReply}
						<div class="mb6 money-exchange money-slider-exchange-pc">
							<PcMoneySliderTwo
								bind:bindValue
								onUpdate={handleUpdate}
								max={detail.device_sale_price} />
						</div>
					{/if}
					<div
						class="mt4 b--pale-grey ba br10 pv4 flex items-center justify-center slider">
						<div class="flex">
							<div>
								<div class="f4 fw6 near-black">
									{$_('device.sellingPrice')}
									({$currency}):
								</div>
								<div class="steel-two tr">{$_('device.youTakePrice')}</div>
							</div>
							<div class="ml5 b f2 near-black">
								{displayMoneyNoCurrencyNoExchange(bindValue)}
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
