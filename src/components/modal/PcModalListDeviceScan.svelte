<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import IconClose from '../icon/IconClose.svelte';
	import { selectDeviceWaitingForScan as apiSelectDeviceWaitingForScan } from '../../services/device';
	import LoadingPage from '../loading/LoadingPage.svelte';
	import { auth } from '../../stores';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import PcRating from '../input/PcRating.svelte';

	const { session } = stores();
	const { domainDevice } = $session;

	export let list = [];
	export let onClose;
	export let detail = {};

	let isLoading = false;
	let isOpenImageScan = false;
	let selectedImg = '';

	const handleSelect = async (item) => {
		await selectDeviceWaitingForScan(item);
		await goto('/my-devices');
	};

	const selectDeviceWaitingForScan = (item) => {
		isLoading = true;
		let token = '';
		if ($auth) {
			token = $auth.accessToken;
		}

		return new Promise((resolve, reject) => {
			apiSelectDeviceWaitingForScan(domainDevice, {
				token: token,
				deviceId: detail.id,
				deviceScanId: item.id,
			})
				.then(() => {
					isLoading = false;
					swal.fire({
						toast: true,
						position: 'top-end',
						icon: 'success',
						title: $_('message.actionSuccess'),
						showConfirmButton: false,
						timerProgressBar: true,
						timer: 1500,
						onOpen: (toast) => {
							toast.addEventListener('mouseenter', swal.stopTimer);
							toast.addEventListener('mouseleave', swal.resumeTimer);
						},
					});
					resolve();
				})
				.catch(() => {
					isLoading = false;
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						reverseButtons: true,
						text: $_('error.serverErrorMessage'),
						customClass: {
							icon: 'icon-error',
						},
					});
					reject();
				});
		});
	};
	const handleOpenImage = (item) => {
		isOpenImageScan = true;
		selectedImg = item.main_info.url_summary_report;
	};
	const handleOnClose = () => {
		if (isOpenImageScan) {
			isOpenImageScan = false;
		} else {
			onClose();
		}
	};
</script>

<style>
	.wrapper {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: calc(100vh - 120px);
		overflow: hidden;
		border-radius: 10px;
		width: 400px;
	}
	.container {
		height: calc(100vh - 120px);
	}
	.content {
		max-height: calc(100vh - 180px);
		overflow: auto;
	}
	.icon-scan {
		width: 28px;
		height: 28px;
	}
</style>

{#if isLoading}
	<LoadingPage />
{:else}
	<div class="fixed z-max wrapper" transition:fade>
		<div class="w-100 bg-white container">
			<div class="h-60-px flex items-center justify-between ph4 fw6 f4 br2">
				<div>{$_('device.yourScanHistory')}</div>
				<div class="pointer flex items-center" on:click={handleOnClose}>
					{#if isOpenImageScan}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							enable-background="new 0 0 24 24"
							viewBox="0 0 24 24"
							fill="#7e8299"
							width="24px"
							height="24px">
							<rect fill="none" height="24" width="24" />
							<path
								d="M9,19l1.41-1.41L5.83,13H22V11H5.83l4.59-4.59L9,5l-7,7L9,19z" />
						</svg>
					{:else}
						<IconClose />
					{/if}
				</div>
			</div>
			<div class="ph4 pb4 content">
				{#if isOpenImageScan}
					<img src={selectedImg} alt="" />
				{:else}
					{#each list as l}
						<div class="flex justify-between items-center pv3 bb b--light-gray">
							<div>
								<div class="fw6 light-silver mb1">{l.timestamp}</div>
								<div>
									<PcRating rating={l.main_info.diamondRating} />
								</div>
							</div>
							<div class="flex">
								<button
									class="bg-blue ba b--blue white br2 h-30-px w3 pointer mr3"
									on:click={() => handleSelect(l)}>Select</button>
								<span
									on:click={() => handleOpenImage(l)}
									class="br2 b--light-blue bg-white ba flex items-center
										justify-center pointer tc icon-scan">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										enable-background="new 0 0 24 24"
										height="24"
										viewBox="0 0 24 24"
										width="24">
										<g>
											<rect fill="none" height="24" width="24" />
										</g>
										<g>
											<g>
												<path
													fill="#3699FF"
													d="M3,11h8V3H3V11z M5,5h4v4H5V5z" />
												<path
													fill="#3699FF"
													d="M3,21h8v-8H3V21z M5,15h4v4H5V15z" />
												<path
													fill="#3699FF"
													d="M13,3v8h8V3H13z M19,9h-4V5h4V9z" />
												<rect
													fill="#3699FF"
													height="2"
													width="2"
													x="19"
													y="19" />
												<rect
													fill="#3699FF"
													height="2"
													width="2"
													x="13"
													y="13" />
												<rect
													fill="#3699FF"
													height="2"
													width="2"
													x="15"
													y="15" />
												<rect
													fill="#3699FF"
													height="2"
													width="2"
													x="13"
													y="17" />
												<rect
													fill="#3699FF"
													height="2"
													width="2"
													x="15"
													y="19" />
												<rect
													fill="#3699FF"
													height="2"
													width="2"
													x="17"
													y="17" />
												<rect
													fill="#3699FF"
													height="2"
													width="2"
													x="17"
													y="13" />
												<rect
													fill="#3699FF"
													height="2"
													width="2"
													x="19"
													y="15" />
											</g>
										</g>
									</svg>
								</span>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}
