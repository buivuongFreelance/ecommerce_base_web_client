<script>
	import { onDestroy, onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import { fade } from 'svelte/transition';

	import { _ } from 'svelte-i18n';
	import MobileInputReadOnly from '../input/MobileInputReadOnly.svelte';
	import MobileSelect from '../input/MobileSelect.svelte';
	import Dimmer from '../loading/Dimmer.svelte';
	import LoadingWidget from '../loading/LoadingWidget.svelte';
	import {
		fieldCapacity,
		fieldColor,
		fieldRam,
		fieldBrand,
		infoImei,
	} from '../../stores';
	import {
		listCapacity as apiListCapacity,
		listRam as apiListRam,
		listColor as apiListColor,
		listBrand as apiListBrand,
	} from '../../services/model';

	export let errors;

	let isLoadingColor = false;
	let isLoadingRam = false;
	let isLoadingCapacity = false;
	let isLoadingBrand = false;

	let serverErrors = {};

	let capacities = [];
	let rams = [];
	let colors = [];
	let brands = [];

	const { session } = stores();
	const { domainModel } = $session;

	onMount(async () => {
		rams = await listRam();
		colors = await listColor();
		capacities = await listCapacity();
		brands = await listBrand();
	});

	onDestroy(() => {
		fieldCapacity.set('');
		fieldColor.set('');
		fieldRam.set('');
		fieldBrand.set('');
		infoImei.set('');
	});

	const listBrand = () => {
		isLoadingBrand = true;
		return new Promise((resolve, reject) => {
			apiListBrand(domainModel)
				.then((list) => {
					isLoadingBrand = false;
					serverErrors.brand = '';
					fieldBrand.set($infoImei.brand_id);

					resolve(list);
				})
				.catch(() => {
					serverErrors.brand = $_('error.serverList');
					isLoadingBrand = false;
					reject();
				});
		});
	};

	const listColor = () => {
		isLoadingColor = true;
		return new Promise((resolve, reject) => {
			apiListColor(domainModel)
				.then((list) => {
					isLoadingColor = false;
					serverErrors.color = '';
					fieldColor.set($infoImei.color_id);

					resolve(list);
				})
				.catch(() => {
					serverErrors.color = $_('error.serverList');
					isLoadingColor = false;
					reject();
				});
		});
	};
	const listRam = () => {
		isLoadingRam = true;
		return new Promise((resolve, reject) => {
			apiListRam(domainModel)
				.then((list) => {
					isLoadingRam = false;
					serverErrors.ram = '';
					fieldRam.set($infoImei.ram_id);

					resolve(list);
				})
				.catch(() => {
					serverErrors.ram = $_('error.serverList');
					isLoadingRam = false;
					reject();
				});
		});
	};
	const listCapacity = () => {
		isLoadingCapacity = true;
		return new Promise((resolve, reject) => {
			apiListCapacity(domainModel)
				.then((list) => {
					isLoadingCapacity = false;
					serverErrors.capacity = '';
					fieldCapacity.set($infoImei.capacity_id);

					resolve(list);
				})
				.catch(() => {
					serverErrors.capacity = $_('error.serverList');
					isLoadingCapacity = false;
					reject();
				});
		});
	};
</script>

{#if $infoImei}
	<h3 class="tc mv5">{$_('device.basicInfo')}</h3>
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Model">{$_('device.model')}</label>
		<MobileInputReadOnly bindValue={$infoImei.model} name="model" />
	</div>
	<!-- <div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Brand">{$_('device.brand')}</label>
		<MobileInputReadOnly bindValue={$infoImei.brand_name} name="brand" />
	</div> -->
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Brand">{$_('device.brand')}</label>
		<div class="relative w-100">
			{#if isLoadingBrand}
				<div class="absolute w-100 top-0">
					<div class="flex items-center h-40-px justify-center z-2">
						<LoadingWidget color="#b5b5c3" />
					</div>
				</div>
				<div class="w-100 h-40-px absolute z-1">
					<Dimmer />
				</div>
			{/if}
			<MobileSelect
				id="brand"
				name="brand"
				val="name"
				bindValue={$fieldBrand}
				onChange={(value) => fieldBrand.set(value)}
				placeholder={'Select Brand'}
				error={serverErrors.brand || errors.brand}
				postfix=""
				list={brands}
			/>
			{#if serverErrors.brand}
				<div class="red fw6 mt2" transition:fade>{serverErrors.brand}</div>
			{:else if errors.brand}
				<div class="red fw6 mt2" transition:fade>{errors.brand}</div>
			{/if}
		</div>
	</div>
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Color">{$_('device.color')}</label>
		<div class="relative w-100">
			{#if isLoadingColor}
				<div class="absolute w-100 top-0">
					<div class="flex items-center h-40-px justify-center z-2">
						<LoadingWidget color="#b5b5c3" />
					</div>
				</div>
				<div class="w-100 h-40-px absolute z-1">
					<Dimmer />
				</div>
			{/if}
			<MobileSelect
				id="color"
				name="color"
				val="name"
				bindValue={$fieldColor}
				onChange={(value) => fieldColor.set(value)}
				placeholder={$_('device.placeholderColor')}
				error={serverErrors.color || errors.color}
				postfix=""
				list={colors}
			/>
			{#if serverErrors.color}
				<div class="red fw6 mt2" transition:fade>{serverErrors.color}</div>
			{:else if errors.color}
				<div class="red fw6 mt2" transition:fade>{errors.color}</div>
			{/if}
		</div>
	</div>
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Model">{$_('device.strCa')}</label>
		<div class="relative w-100">
			{#if isLoadingCapacity}
				<div class="absolute w-100 top-0">
					<div class="flex items-center h-40-px justify-center z-2">
						<LoadingWidget color="#b5b5c3" />
					</div>
				</div>
				<div class="w-100 h-40-px absolute z-1">
					<Dimmer />
				</div>
			{/if}
			<MobileSelect
				id="capacity"
				name="capacity"
				bindValue={$fieldCapacity}
				placeholder={$_('device.placeholderCapacity')}
				error={serverErrors.capacity || errors.capacity}
				postfix="GB"
				onChange={(value) => fieldCapacity.set(value)}
				list={capacities}
			/>
			{#if serverErrors.capacity}
				<div class="red fw6 mt2" transition:fade>{serverErrors.capacity}</div>
			{:else if errors.capacity}
				<div class="red fw6 mt2" transition:fade>{errors.capacity}</div>
			{/if}
		</div>
	</div>
	<div class="mb5 flex items-center justify-between">
		<label class="fw6 f6 tr w-label" for="Ram">{$_('device.ram')}</label>
		<div class="relative w-100">
			{#if isLoadingRam}
				<div class="absolute w-100 top-0">
					<div class="flex items-center h-40-px justify-center z-2">
						<LoadingWidget color="#b5b5c3" />
					</div>
				</div>
				<div class="w-100 h-40-px absolute z-1">
					<Dimmer />
				</div>
			{/if}
			<MobileSelect
				placeholder={$_('device.placeholderRam')}
				id="ram"
				name="ram"
				bindValue={$fieldRam}
				onChange={(value) => fieldRam.set(value)}
				error={serverErrors.ram || errors.ram}
				postfix="GB"
				list={rams}
			/>
			{#if serverErrors.ram}
				<div class="red fw6 mt2" transition:fade>{serverErrors.ram}</div>
			{:else if errors.ram}
				<div class="red fw6 mt2" transition:fade>{errors.ram}</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.w-label {
		width: 200px;
		margin-right: 30px;
	}
</style>
