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
	import TabletModalSelectBrandWishlist from './TabletModalSelectBrandWishlist.svelte';
	import MobileDeviceItem from '../device/MobileDeviceItem.svelte';
	import MobileModalSelectBrandWishlist from './MobileModalSelectBrandWishlist.svelte';
	import IconClose from '../icon/IconClose.svelte';

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
		<MobileModalSelectBrandWishlist
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
	<div class="spacing-ext">
		<h1 class="page__title tc ttc">{$_('wishlist.myWishlists')}</h1>
		<p class="i tc light-silver">{$_('wishlist.descmyWishlists')}</p>
		<div class="mt2rem tc">
			<button
				on:click={handleOpenModel}
				class="h-40-px fw6 br2 ba bg-dark-blue white b--dark-blue ph2rem pointer
				pulse animated infinite slower"
			>
				{$_('wishlist.selectYourWishlist')}
			</button>
		</div>
	</div>

	<div class="bg-light-gray pv2rem mt2rem bt b--light-gray">
		{#if isLoading}
			<ContentLoader width="320" uniqueKey="wishlists">
				<rect x="0" y="0" rx="5" ry="5" width="320" height="200" />
			</ContentLoader>
		{:else if list.length > 0}
			<div class="spacing-ext hashtags flex">
				{#each list as item}
					<div
						class="hashtag f7 bg-white br2 h-30-px lh-30-px pl1rem mr3 mb3 flex"
					>
						<span class="ttc">{item.name}</span>
						<span
							on:click={handleRemove(item)}
							class="w-30-px flex items-center justify-center pointer"
						>
							<IconClose fill="#6C7293" size="12" />
						</span>
					</div>
				{/each}
			</div>
		{/if}
		{#if isLoadingDevice}
			<ContentLoader width="375" uniqueKey="wishlists">
				<rect x="0" y="0" rx="5" ry="5" width="1170" height="400" />
			</ContentLoader>
		{:else if listDevice.length > 0}
			<div class="flex flex-wrap justify-between mt1rem">
				{#each listDevice as item}
					<div class="item mb3">
						<MobileDeviceItem {item} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.w-30-px {
		width: 30px;
	}

	.hashtags {
		flex-wrap: wrap;
	}
	.item {
		width: calc(50% - 1px);
		margin-bottom: 2px;
	}
</style>
