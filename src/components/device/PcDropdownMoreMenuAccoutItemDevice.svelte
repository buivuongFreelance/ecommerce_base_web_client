<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import swal from 'sweetalert2';
	import Portal from 'svelte-portal';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import { stores, goto } from '@sapper/app';
	import { auth } from '../../stores';
	import { deleteDevice as apiDeleteDevice } from '../../services/device';
	import LoadingPage from '../loading/LoadingPage.svelte';
	import config from '../../config';

	const { session } = stores();
	const { domainDevice } = $session;

	export let id;
	export let onSuccess;
	export let status;
	export let isOpenQrCode;
	export let onSelectLowerPrice;
	export let onTestBasicScan;

	let isOpenMenu = false;
	let isLoading = false;

	const deleteDevice = () => {
		isLoading = true;
		let token = '';
		if ($auth) token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiDeleteDevice(domainDevice, { token, id })
				.then(() => {
					isLoading = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					reject();
				});
		});
	};

	const handleMenuOpen = () => {
		if (!isOpenMenu) isOpenMenu = true;
	};
	const handleMenuClose = () => {
		if (isOpenMenu) isOpenMenu = false;
	};

	const handleRemoveDevice = () => {
		handleMenuClose();
		swal
			.fire({
				position: 'top',
				icon: 'question',
				showCancelButton: true,
				cancelButtonText: $_('message.no'),
				confirmButtonText: $_('message.yes'),
				reverseButtons: true,
				customClass: {
					icon: 'icon-question',
				},
				title: $_('device.removeDevice'),
				text: $_('device.questionRemoveCreated'),
			})
			.then((result) => {
				if (result.value) {
					deleteDevice().then(() => {
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
						onSuccess();
					});
				}
			});
	};
</script>

{#if isLoading}
	<Portal target={document.getElementById('portal')}>
		<LoadingPage />
	</Portal>
{/if}

<div
	class="ml3 relative btn-icon pointer ba b--light-gray bg-light-gray "
	on:mouseenter={handleMenuOpen}
	on:mouseleave={handleMenuClose}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="#3F4254"
		width="24px"
		height="24px"
	>
		<path d="M0 0h24v24H0z" fill="none" />
		<path
			d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2
				2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9
				2-2-.9-2-2-2z"
		/>
	</svg>
	{#if isOpenMenu}
		<ul
			transition:fade
			class="z-max absolute list ma0 pv3 ph0 bg-white br2 shadow-1 popup top-2"
		>
			{#if status === config.device.created}
				<!-- edit device -->
				<li
					class="lh-copy pointer"
					on:click={async () => {
						await goto('/my-devices/edit-device/' + id);
					}}
				>
					<div class="pv3 spacing-ext flex items-center self-center dim">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#9fb0c9"
							width="24px"
							height="24px"
						>
							<path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71
									7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41
									0l-1.83 1.83 3.75 3.75 1.83-1.83z"
							/>
						</svg>
						<span class="ml3 fw6"> {$_('device.editDevice')} </span>
					</div>
				</li>
				<!-- remove device -->
				<li class="lh-copy pointer" on:click={handleRemoveDevice}>
					<div class="pv3 spacing-ext flex items-center self-center dim">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#9fb0c9"
							width="24px"
							height="24px"
						>
							<path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19
									4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
							/>
						</svg>
						<span class="ml3 near-black fw6">
							{$_('device.removeDevice')}
						</span>
					</div>
				</li>
			{:else}
				{#if status !== config.device.waitingForScan}
					<!-- scan device -->
					<li class="lh-copy pointer">
						<div
							class="pv3 spacing-ext flex items-center self-center dim"
							on:click={() => (isOpenQrCode = true)}
						>
							<svg width="24" height="24" fill="#9fb0c9" viewBox="0 0 244 387.2"
								><path
									d="M304.8,10.84v0a36.62,36.62,0,0,0-26-10.8H108.32A36.85,36.85,0,0,0,71.6,36.72V350.44a36.87,36.87,0,0,0,36.72,36.76H278.88a36.87,36.87,0,0,0,36.72-36.72V36.76A36.65,36.65,0,0,0,304.8,10.84ZM193.6,362.28h0a9.92,9.92,0,1,1,9.92-9.92A9.92,9.92,0,0,1,193.6,362.28ZM286.44,300a24,24,0,0,1-24,24H124.72a24,24,0,0,1-24-24V66.2a24,24,0,0,1,24-24H262.48a24,24,0,0,1,24,24Z"
									transform="translate(-71.6)"
								/>
								<path
									d="M234,218.74A70.46,70.46,0,1,0,218.74,234l46,46L280,264.73l-46-46ZM177.4,226A48.6,48.6,0,1,1,226,177.4,48.65,48.65,0,0,1,177.4,226Z"
									transform="translate(-71.6)"
								/>
							</svg>
							<span class="ml3 fw6"> {$_('device.scanPostDevice')} </span>
						</div>
					</li>
				{/if}

				<!-- lower your price -->
				<li class="lh-copy pointer">
					<div
						class="pv3 spacing-ext flex items-center self-center dim"
						on:click={onSelectLowerPrice}
					>
						<svg
							id="Layer_1"
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="24"
							height="24"
							fill="#9fb0c9"
							><defs>
								<style>
									.cls-1 {
										fill: none;
									}
								</style>
							</defs>
							<path class="cls-1" d="M0,0H24V24H0ZM0,0H24V24H0ZM0,0H24V24H0Z" />
							<path d="M7.41,20l3-3h-2V4h-2V17h-2Z" />
							<path
								d="M16.63,9.63c-1.43-.37-1.89-.75-1.89-1.35s.63-1.17,1.7-1.17S18,7.65,18,8.43h1.4a2.52,2.52,0,0,0-2-2.4V4.65H15.49V6a2.46,2.46,0,0,0-2.2,2.28c0,1.46,1.2,2.18,3,2.6,1.57.38,1.89.94,1.89,1.52s-.31,1.13-1.7,1.13-1.81-.58-1.88-1.32H13.17a2.64,2.64,0,0,0,2.32,2.41V16h1.89V14.64c1.23-.23,2.21-.94,2.21-2.23C19.59,10.62,18.06,10,16.63,9.63Z"
							/>
						</svg>
						<span class="ml3 fw6"> {$_('label.lowerPrice')}</span>
					</div>
				</li>

				<!-- lower your price -->
				<li class="lh-copy pointer">
					<div
						class="pv3 spacing-ext flex items-center self-center dim"
						on:click={onTestBasicScan}
					>
						<svg
							id="Layer_1"
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="24"
							height="24"
							fill="#9fb0c9"
							><defs>
								<style>
									.cls-1 {
										fill: none;
									}
								</style>
							</defs>
							<path class="cls-1" d="M0,0H24V24H0ZM0,0H24V24H0ZM0,0H24V24H0Z" />
							<path d="M7.41,20l3-3h-2V4h-2V17h-2Z" />
							<path
								d="M16.63,9.63c-1.43-.37-1.89-.75-1.89-1.35s.63-1.17,1.7-1.17S18,7.65,18,8.43h1.4a2.52,2.52,0,0,0-2-2.4V4.65H15.49V6a2.46,2.46,0,0,0-2.2,2.28c0,1.46,1.2,2.18,3,2.6,1.57.38,1.89.94,1.89,1.52s-.31,1.13-1.7,1.13-1.81-.58-1.88-1.32H13.17a2.64,2.64,0,0,0,2.32,2.41V16h1.89V14.64c1.23-.23,2.21-.94,2.21-2.23C19.59,10.62,18.06,10,16.63,9.63Z"
							/>
						</svg>
						<span class="ml3 fw6">Test Scan</span>
					</div>
				</li>

				<!-- edit post device -->
				<li
					class="lh-copy pointer"
					on:click={async () => {
						await goto('/my-devices/post-device/edit/' + id);
					}}
				>
					<div class="pv3 spacing-ext flex items-center self-center dim">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="#9fb0c9"
							width="24px"
							height="24px"
						>
							<path d="M0 0h24v24H0z" fill="none" />
							<path
								d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71
									7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41
									0l-1.83 1.83 3.75 3.75 1.83-1.83z"
							/>
						</svg>
						<span class="ml3 fw6"> {$_('device.editPostDevice')} </span>
					</div>
				</li>
			{/if}
		</ul>
	{/if}
</div>

<style>
	.popup {
		top: 39px;
		right: 0;
		width: 200px;
	}
	.btn-icon {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		border-radius: 4px;
	}
</style>
