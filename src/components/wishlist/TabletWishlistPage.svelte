<script>
	import { _ } from 'svelte-i18n';
	import { auth } from '../../stores';
	import { stores } from '@sapper/app';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import ContentLoader from 'svelte-content-loader';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';

	import {
		listDeviceTags as apiListDeviceTags,
		removeDeviceTag as apiRemoveDeviceTag,
		listDeviceByDeviceTags as apiListDeviceByDeviceTags,
	} from '../../services/device.js';
	import { onMount } from 'svelte';
	import PcDeviceItem from '../device/PcDeviceItem.svelte';
	import TabletModalSelectBrandWishlist from './TabletModalSelectBrandWishlist.svelte';

	const { session } = stores();
	const { domainDevice } = $session;
	let list = [];
	let listDevice = [];
	let isServerError = false;
	let isLoading = false;
	let isLoadingDevice = false;

	let isOpenModel = false;
	$: {
		if (isOpenModel) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	onMount(async () => {
		await listDeviceTags();
		listDeviceByDeviceTags();
	});
	const listDeviceTags = () => {
		isLoading = true;
		const token = $auth.accessToken;
		return new Promise((resolve, reject) => {
			apiListDeviceTags(domainDevice, {
				token,
			})
				.then((items) => {
					isLoading = false;
					list = items;
					isServerError = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const removeDeviceTag = (item) => {
		isLoading = true;
		const token = $auth.accessToken;
		return new Promise((resolve, reject) => {
			apiRemoveDeviceTag(domainDevice, {
				token,
				id: item.id,
			})
				.then(() => {
					isLoading = false;
					resolve();
				})
				.catch(() => {
					isLoading = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handleRemove = (item) => {
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
				title: $_('wishlist.removeWishlist'),
				text: $_('device.questionRemoveCreated'),
			})
			.then(async (result) => {
				if (result.value) {
					await removeDeviceTag(item).then(() => {
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
						listDeviceTags();
						setTimeout(() => {
							listDeviceByDeviceTags();
						}, 200);
					});
				}
			});
	};
	const listDeviceByDeviceTags = () => {
		isLoadingDevice = true;
		const token = $auth.accessToken;
		return new Promise((resolve, reject) => {
			apiListDeviceByDeviceTags(domainDevice, {
				token,
				deviceTags: list,
			})
				.then((items) => {
					isLoadingDevice = false;
					listDevice = items;
					isServerError = false;
					resolve();
				})
				.catch(() => {
					isLoadingDevice = false;
					isServerError = true;
					reject();
				});
		});
	};
	const handleOpenModel = () => {
		isOpenModel = true;
	};
</script>

{#if isOpenModel}
	<Portal target={document.getElementById('portal')}>
		<DimmerModal type="modal" onClick={() => (isOpenModel = false)} />
		<TabletModalSelectBrandWishlist
			listExclude={list}
			onClose={() => {
				isOpenModel = false;
				listDeviceTags();
				setTimeout(() => {
					listDeviceByDeviceTags();
				}, 200);
			}}
		/>
	</Portal>
{/if}
{#if isServerError}
	<div class="w-100 spacing-ext pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<div class="w-100 spacing-ext pt5 pb3">
		<h2 class="mb3 ttc">{$_('wishlist.myWishlists')}</h2>
		<p class="i mb5">
			{$_('wishlist.descmyWishlists')}
		</p>
		<div class="">
			<button
				on:click={handleOpenModel}
				class="h-50-px fw6 br1 ba bg-dark-blue white b--dark-blue ph4 pointer
				animate__heartBeat animate__animated"
				>{$_('wishlist.selectYourWishlist')}</button
			>
		</div>
		<hr class="bt b--light-gray mv5" />

		{#if isLoading}
			<ContentLoader width="768" uniqueKey="wishlists">
				<rect x="0" y="0" rx="5" ry="5" width="768" height="400" />
			</ContentLoader>
		{:else if list.length > 0}
			<div class="hashtags flex">
				{#each list as item}
					<div class="hashtag flex mr3 mb3">
						<label class="checkbox">
							<input type="checkbox" checked />
							<span class="ttc">{item.name}</span>
						</label>
						<div
							on:click={handleRemove(item)}
							class="w-30-px bg-red flex items-center justify-center pointer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="12px"
								width="12px"
								viewBox="0 0 24 24"
								fill="#ffffff"
								><path d="M0 0h24v24H0V0z" fill="none" />
								<path
									d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
								/></svg
							>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="f4">{$_('message.noItems')}</p>
		{/if}
		<hr class="bt b--light-gray mv5" />
		{#if isLoadingDevice}
			<ContentLoader width="1170" uniqueKey="wishlists">
				<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
			</ContentLoader>
		{:else if listDevice.length > 0}
			<div class="flex flex-wrap row">
				{#each listDevice as item}
					<div class="item pl4 mb4">
						<PcDeviceItem {item} />
					</div>
				{/each}
			</div>
		{:else}
			<p class="f4">{$_('message.noItems')}</p>
		{/if}
	</div>
{/if}

<style>
	:root {
		--animate-duration: 1s;
		--animate-delay: 1s;
		--animate-repeat: 5;
	}
	hr {
		border-top: none;
	}

	@-webkit-keyframes heartBeat {
		0% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		14% {
			-webkit-transform: scale(1.1);
			transform: scale(1.1);
		}

		28% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		42% {
			-webkit-transform: scale(1.1);
			transform: scale(1.1);
		}

		70% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}

	@keyframes heartBeat {
		0% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		14% {
			-webkit-transform: scale(1.1);
			transform: scale(1.1);
		}

		28% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		42% {
			-webkit-transform: scale(1.1);
			transform: scale(1.1);
		}

		70% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}
	.animate__heartBeat {
		-webkit-animation-name: heartBeat;
		animation-name: heartBeat;
		-webkit-animation-duration: 1.3s;
		animation-duration: 1.3s;
		-webkit-animation-duration: calc(var(--animate-duration) * 1.3);
		animation-duration: calc(var(--animate-duration) * 1.3);
		-webkit-animation-timing-function: ease-in-out;
		animation-timing-function: ease-in-out;
	}
	.animate__animated {
		-webkit-animation-duration: 1s;
		animation-duration: 1s;
		-webkit-animation-duration: var(--animate-duration);
		animation-duration: var(--animate-duration);
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
		animation-iteration-count: 3;
	}

	.checkbox {
		display: inline-flex;
		cursor: pointer;
	}
	.checkbox input {
		display: none;
	}
	.checkbox input + span {
		display: block;
		padding: 0 20px;
		background-color: #e4e6ef;
		color: #3f4254;
		font-weight: 600;
		height: 30px;
		line-height: 30px;
	}
	.checkbox input:checked + span {
		background-color: #2f3a97;
		color: white;
	}
	.w-30-px {
		width: 30px;
	}
	.hashtag {
		border-radius: 2px;
		overflow: hidden;
	}
	.hashtags {
		flex-wrap: wrap;
	}
	.item {
		width: 25%;
	}
	.row {
		margin-left: -20px;
	}
</style>
