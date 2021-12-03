<script>
	import { _ } from 'svelte-i18n';
	import config from '../../config';
	import { goto } from '@sapper/app';
	import {
		displayExchangeStr,
		displayMoneyNoCurrency,
		displayMoneyNoCurrencyNoExchange,
	} from '../../functions';
	import { currency } from '../../stores';
	import PcMoneyExchangeSliderTwo from '../form/PcMoneyExchangeSliderTwo.svelte';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalImageScan from '../modal/PcModalImageScan.svelte';
	import PcTagDevice from '../device/PcTagDevice.svelte';
	import PcPhysicalCondition from '../input/PcPhysicalCondition.svelte';
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
		height: 40px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	.border-white-three {
		border-color: #dfdfdf;
	}
	.content {
		width: 100%;
	}

	.image-device {
		border-radius: 3px;
		width: 60px;
		height: 80px;
		padding: 2px;
		object-fit: cover;
	}
	.money-exchange {
		margin-top: 80px;
	}
	.close {
		position: absolute;
		top: -10px;
		right: -10px;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		cursor: pointer;
	}
</style>

<div
	class="panel w-100 bg-dark-blue br--top flex items-center justify-between pl3 pr3">
	<div class="white fw6 f">{$_('cart.offerDevices')}</div>
	<slot name="header" />
</div>

{#if detail}
	<div
		class="w-100 flex items-center justify-center border-white-three ba br2
			br--bottom pv5">
		<div class="content ph3">
			<div class="flex justify-between">
				<div class="fw6 steel-two i tc">
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
						class="ml4 link bg-light-gray br2 ba fw6 h-30-px near-black
			b--pale-grey pointer flex items-center justify-center dim pa3 f6">{$_('message.reset')}</button>
				{/if}
			</div>
			<div class="mb4 w-100 flex justify-center">
				{#if selectedExchangeDevices}
					{#if selectedExchangeDevices.length > 0}
						{#each selectedExchangeDevices as exchangeDevice}
							<div
								class="flex flex-column items-center justify-center  mr4
							relative bt b--light-gray pt3 mt3">
								<div
									class="close bg-red flex items-center justify-center pointer grow"
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
											<div class="i yellow fw6 mb3">
												{$_('message.deviceIsNotScanned')}
											</div>
										{/if}

										<h5
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
										</h5>

										<div class="gray mb3">
											{$_('device.brand')}
											<span class="mh1">:</span>
											{exchangeDevice.brand_name}
										</div>

										<div class="mb3">
											{$_('device.physicalGrading')}
											<span class="mh1">:</span>
											<PcPhysicalCondition
												grade={exchangeDevice.physical_grading}
												right={true} />
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
						<div class="mb6 money-exchange w-90 money-slider-sell-mobile">
							<PcMoneyExchangeSliderTwo
								bind:bindValue
								onUpdate={handleUpdate} />
						</div>
					{/if}
					<div
						class="mt4 b--pale-grey ba br10 pv4 flex items-center justify-center w-100">
						<div class="flex">
							<div>
								<div class="fw6 near-black">
									{$_('device.exchangePrice')}
									({$currency}):
								</div>
								<div class="steel-two tr">
									{$_(displayExchangeStr(bindValue))}
								</div>
							</div>
							<div class="ml4 b f4 near-black">
								{displayMoneyNoCurrency(bindValue)}
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="flex flex-column items-center justify-center">
					{#if detail.status !== config.proposal.sellerAccept && detail.status !== config.proposal.sellerReply}
						<div class="mb6 money-exchange w-90 money-slider-sell-mobile">
							<PcMoneySliderTwo
								bind:bindValue
								onUpdate={handleUpdate}
								max={detail.device_sale_price} />
						</div>
					{/if}
					<div
						class="mt4 b--pale-grey ba br10 pv4 flex items-center justify-center w-100">
						<div class="flex">
							<div>
								<div class="fw6 near-black">
									{$_('device.sellingPrice')}
									({$currency}):
								</div>
								<div class="steel-two tr">{$_('device.youTakePrice')}</div>
							</div>
							<div class="ml4 b f4 near-black">
								{displayMoneyNoCurrencyNoExchange(bindValue)}
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
