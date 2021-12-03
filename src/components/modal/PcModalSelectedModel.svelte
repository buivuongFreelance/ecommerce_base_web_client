<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { stores } from '@sapper/app';
	import { selectedModel, selectedExchangeDevice } from '../../stores';
	import LazyLoad from 'vanilla-lazyload';
	import { onDestroy, onMount } from 'svelte';
	import * as yup from 'yup';

	import {
		listCapacity as apiListCapacity,
		listColor as apiListColor,
	} from '../../services/model';
	import LoadingWidget from '../loading/LoadingWidget.svelte';
	import Dimmer from '../loading/Dimmer.svelte';
	import { extractError, extractErrors } from '../../functions';
	import MobileSelectName from '../input/MobileSelectName.svelte';

	const { session } = stores();
	const { domainModel } = $session;

	export let onBack;
	export let onClose;

	let observer;
	let containerEle;

	let values = {
		//ram: '',
		color: '',
		capacity: '',
	};
	let names = {
		capacity_name: '',
		//ram_name: '',
		color_name: '',
	};
	let errors = {};
	let serverErrors = {};
	let capacities = [];
	//let rams = [];
	let colors = [];

	let isLoadingColor = false;
	//let isLoadingRam = false;
	let isLoadingCapacity = false;

	const schema = yup.object().shape({
		//ram: yup.string($_('error.string')).required($_('error.required')),
		color: yup.string($_('error.string')).required($_('error.required')),
		capacity: yup.string($_('error.string')).required($_('error.required')),
	});

	onMount(async () => {
		setTimeout(() => {
			observer = new LazyLoad({
				container: containerEle,
				elements_selector: '.lazy',
			});
			observer.update();
		}, 200);
		//rams = await listRam();
		colors = await listColor();
		capacities = await listCapacity();
	});

	onDestroy(() => {
		selectedModel.set(null);
		if (observer) {
			if (typeof observer.destroy === 'function') {
				observer.destroy();
			}
		}
	});

	const validate = async (field, value, name) => {
		values[field] = value;
		names[field + '_name'] = name;
		try {
			await schema.validateAt(field, values);
			errors[field] = '';
		} catch (error) {
			errors[field] = extractError(error, field);
		}
	};

	const handleSubmit = async () => {
		try {
			await schema.validate(values, { abortEarly: false });
			selectedExchangeDevice.set({ ...$selectedModel, ...values, ...names });
			onClose();
			errors = {};
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
			} else {
				values.email = '';
				values.password = '';
			}
		}
	};

	const listColor = () => {
		isLoadingColor = true;
		return new Promise((resolve, reject) => {
			apiListColor(domainModel)
				.then((list) => {
					isLoadingColor = false;
					serverErrors.color = '';

					resolve(list);
				})
				.catch(() => {
					serverErrors.color = $_('error.serverList');
					isLoadingColor = false;
					reject();
				});
		});
	};
	// const listRam = () => {
	// 	isLoadingRam = true;
	// 	return new Promise((resolve, reject) => {
	// 		apiListRam(domainModel)
	// 			.then((list) => {
	// 				isLoadingRam = false;
	// 				serverErrors.ram = '';

	// 				resolve(list);
	// 			})
	// 			.catch(() => {
	// 				serverErrors.ram = $_('error.serverList');
	// 				isLoadingRam = false;
	// 				reject();
	// 			});
	// 	});
	// };
	const listCapacity = () => {
		isLoadingCapacity = true;
		return new Promise((resolve, reject) => {
			apiListCapacity(domainModel)
				.then((list) => {
					isLoadingCapacity = false;
					serverErrors.capacity = '';

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

<style>
	.back {
		width: 40px;
		height: 40px;
		background-color: #f3f6f9;
		border-radius: 50%;
		border: 1px solid #e0e6ef;
	}
	.image {
		width: 180px;
		height: 240px;
		object-fit: cover;
	}
	.w-label {
		width: 100px;
		text-align: right;
		margin-right: 30px;
	}
	.w-input {
		width: 270px;
	}
	.w-100-px {
		width: 100px;
	}
	.field-error {
		margin-left: 130px;
	}
</style>

<div class="flex items-center justify-center ph6">
	<div class="w-50">
		<div
			class="back pointer flex items-center justify-center grow"
			on:click={onBack}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 0 24 24"
				fill="#3f4254"
				width="24"><path d="M0 0h24v24H0V0z" fill="none" />
				<path
					d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
		</div>
		{#if $selectedModel}
			<div class="flex flex-column items-center justify-center">
				<div class="ba br2 b--pale-grey pa3 mt3" bind:this={containerEle}>
					<img
						class="image lazy"
						src={'images/phone_default.png'}
						data-src={$selectedModel.model_image_url}
						alt={$selectedModel.model_name} />
				</div>
				<div class="mt3 fw6 near-black">{$selectedModel.model_name}</div>
			</div>
		{/if}
	</div>
	<div class="w-50">
		<div class="mb5 fw6 f4 near-black">{$_('message.chooseOption')}</div>
		<form novalidate on:submit|preventDefault={handleSubmit}>
			<!-- <div class="flex items-center">
				<label class="fw6 f6 tr w-label" for="Ram">{$_('device.ram')}</label>
				<div class="relative w-input">
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
					<MobileSelectName
						placeholder={$_('device.placeholderRam')}
						id="ram"
						name="ram"
						bindValue={values.ram}
						onChange={(value, text) => {
							validate('ram', value, text);
						}}
						error={serverErrors.ram || errors.ram}
						postfix="GB"
						list={rams} />
				</div>
			</div>
			{#if serverErrors.ram}
				<div class="field-error red fw6 mt2" transition:fade>
					{serverErrors.ram}
				</div>
			{:else if errors.ram}
				<div class="field-error red fw6 mt2" transition:fade>{errors.ram}</div>
			{/if} -->
			<div class="mt4 flex items-center">
				<label
					class="fw6 f6 tr w-label"
					for="Color">{$_('device.color')}</label>
				<div class="relative w-input">
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
					<MobileSelectName
						id="color"
						name="color"
						val="name"
						bindValue={values.color}
						onChange={(value, name) => validate('color', value, name)}
						placeholder={$_('device.placeholderColor')}
						error={serverErrors.color || errors.color}
						postfix=""
						list={colors} />
				</div>
			</div>
			{#if serverErrors.color}
				<div class="red fw6 mt2 field-error" transition:fade>
					{serverErrors.color}
				</div>
			{:else if errors.color}
				<div class="red fw6 mt2 field-error" transition:fade>
					{errors.color}
				</div>
			{/if}
			<div class="mt4 flex items-center">
				<label
					class="fw6 f6 tr w-label"
					for="Model">{$_('device.strCa')}</label>
				<div class="relative w-input">
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
					<MobileSelectName
						id="capacity"
						name="capacity"
						bindValue={values.capacity}
						placeholder={$_('device.placeholderCapacity')}
						error={serverErrors.capacity || errors.capacity}
						postfix="GB"
						onChange={(value, name) => validate('capacity', value, name)}
						list={capacities} />
				</div>
			</div>
			{#if serverErrors.capacity}
				<div class="red field-error fw6 mt2" transition:fade>
					{serverErrors.capacity}
				</div>
			{:else if errors.capacity}
				<div class="red field-error fw6 mt2" transition:fade>
					{errors.capacity}
				</div>
			{/if}
			<div class="flex justify-center mt5">
				<button
					type="button"
					on:click={onClose}
					class="br2 bg-light-gray b--light-gray ba grow ttu h-40-px fw6 tracked
						w-100-px mr3 near-black pointer">{$_('message.cancel')}</button>
				<button
					type="submit"
					class="br2 bg-dark-blue b--dark-blue ba grow ttu h-40-px fw6 tracked
						w-100-px white pointer">{$_('message.finish')}</button>
			</div>
		</form>
	</div>
</div>
