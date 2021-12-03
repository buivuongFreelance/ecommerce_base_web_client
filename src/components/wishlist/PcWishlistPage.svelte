<script>
	import { _ } from 'svelte-i18n';
	import { auth, cartChanged, favoriteChanged } from '../../stores';
	import { stores } from '@sapper/app';
	import Portal from 'svelte-portal';
	import DimmerModal from '../loading/DimmerModal.svelte';
	import PcModalSelectBrandWishlist from './PcModalSelectBrandWishlist.svelte';
	import ContentLoader from 'svelte-content-loader';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';

	import {
		listDeviceTags as apiListDeviceTags,
		removeDeviceTag as apiRemoveDeviceTag,
		listDeviceByDeviceTags as apiListDeviceByDeviceTags,
	} from '../../services/device.js';
	import { onDestroy, onMount } from 'svelte';
	import PcDeviceItem from '../device/PcDeviceItem.svelte';
	import IconClose from '../icon/IconClose.svelte';

	const { session } = stores();
	const { domainDevice } = $session;
	let list = [];
	let listDevice = [];
	let isServerError = false;
	let isLoading = false;
	let isLoadingDevice = false;

	let isOpenModel = false;
	let mounted = false;
	$: {
		if (isOpenModel) {
			document.body.classList.add('noscroll');
		} else {
			document.body.classList.remove('noscroll');
		}
	}

	const unsubscribeCartChanged = cartChanged.subscribe(async (value) => {
		if (value) {
			if (mounted) {
				listDeviceByDeviceTags();
			}
		}
	});

	const unsubscribeFavoriteChanged = favoriteChanged.subscribe(
		async (value) => {
			if (value) {
				if (mounted) {
					listDeviceByDeviceTags();
				}
			}
		}
	);

	onMount(async () => {
		await listDeviceTags();
		await listDeviceByDeviceTags();
		mounted = true;
	});

	onDestroy(() => {
		unsubscribeCartChanged();
		unsubscribeFavoriteChanged();
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
		<PcModalSelectBrandWishlist
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
	<div class="mw10 center pt5">
		<p class="red f4">{$_('error.serverErrorMessage')}</p>
	</div>
{:else}
	<div class="mw10 center pt5 pb3">
		<h2 class="mb3 ttc">{$_('wishlist.myWishlists')}</h2>
		<p class="i mb5">
			{$_('wishlist.descmyWishlists')}
		</p>
		<div class="">
			<button
				on:click={handleOpenModel}
				class="h-40-px fw6 br2 ba bg-dark-blue white b--dark-blue ph4 pointer
				heartBeat animated"
				>{$_('wishlist.selectYourWishlist')}</button
			>
		</div>

		{#if isLoading}
			<ContentLoader width="1170" uniqueKey="wishlists">
				<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
			</ContentLoader>
		{:else if list.length > 0}
			<hr class="bt b--light-gray mv5" />
			<div class="hashtags flex">
				{#each list as item}
					<div class="hashtag flex mr3 mb3">
						<label class="checkbox">
							<input type="checkbox" checked />
							<span class="ttc">{item.name}</span>
						</label>
						<div
							on:click={handleRemove(item)}
							class="w-40-px bg-dark-blue flex items-center justify-center pointer"
						>
							<IconClose size="20" fill="white" />
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if isLoadingDevice}
			<ContentLoader width="1170" uniqueKey="wishlists">
				<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
			</ContentLoader>
		{:else if listDevice.length > 0}
			<hr class="bt b--light-gray mv5" />
			<div class="flex flex-wrap row">
				{#each listDevice as item}
					<div class="item pl4 mb4">
						<PcDeviceItem {item} />
					</div>
				{/each}
			</div>
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

	.checkbox {
		display: inline-flex;
		cursor: pointer;
	}
	.checkbox input {
		display: none;
	}
	.checkbox input + span {
		display: block;
		padding: 0 10px 0 20px;
		background-color: #e4e6ef;
		color: #3f4254;

		height: 40px;
		line-height: 40px;
	}
	.checkbox input:checked + span {
		background-color: #2f3a97;
		color: white;
	}
	.w-40-px {
		width: 40px;
	}
	.hashtag {
		border-radius: 4px;
		overflow: hidden;
	}
	.hashtags {
		flex-wrap: wrap;
	}
	.item {
		width: 20%;
	}
	.row {
		margin-left: -20px;
	}
</style>
