<script>
	import { _ } from 'svelte-i18n';
	import { stores, goto } from '@sapper/app';
	import { fade } from 'svelte/transition';
	import MobileBasicInfo from '../device/MobileBasicInfo.svelte';
	import MobileGradeDevice from '../device/MobileGradeDevice.svelte';
	import { extractError, extractErrors, isObjectEmpty } from '../../functions';
	import * as yup from 'yup';
	import {
		fieldCapacity,
		fieldColor,
		fieldRam,
		fieldPhysicalGrading,
		infoImei,
		auth,
	} from '../../stores';
	import { addDevice as apiAddDevice } from '../../services/device';
	import { onDestroy, onMount } from 'svelte';
	import LoadingDefault from '../loading/LoadingDefault.svelte';
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';

	const { session } = stores();
	const { domainDevice } = $session;

	export let onErrors;

	let values = {
		ram: '',
		color: '',
		capacity: '',
		physicalGrading: '',
	};
	let errors = {};
	let isLoading = false;
	let mounted = false;

	const schema = yup.object().shape({
		ram: yup.string($_('error.string')).required($_('error.required')),
		color: yup.string($_('error.string')).required($_('error.required')),
		capacity: yup.string($_('error.string')).required($_('error.required')),
		physicalGrading: yup
			.string($_('error.string'))
			.required($_('error.required')),
	});

	const unsubscribeCapacity = fieldCapacity.subscribe((value) => {
		values.capacity = value;
		if (value) {
			if (mounted) {
				validate('capacity');
			}
		}
	});

	const unsubscribeRam = fieldRam.subscribe((value) => {
		values.ram = value;
		if (value) {
			if (mounted) {
				validate('ram');
			}
		}
	});

	const unsubscribeColor = fieldColor.subscribe((value) => {
		values.color = value;
		if (value) {
			if (mounted) {
				validate('color');
			}
		}
	});

	const unsubscribePhysicalGrading = fieldPhysicalGrading.subscribe((value) => {
		values.physicalGrading = value;
		if (value) {
			if (mounted) {
				validate('physicalGrading');
			}
		}
	});

	onMount(() => {
		mounted = true;
	});
	onDestroy(() => {
		unsubscribeCapacity();
		unsubscribeColor();
		unsubscribeRam();
		unsubscribePhysicalGrading();
	});

	const addDevice = () => {
		isLoading = true;
		const token = $auth.accessToken;

		return new Promise((resolve, reject) => {
			apiAddDevice(domainDevice, {
				modelId: $infoImei.model_id,
				imei: $infoImei.imei,
				capacityId: $fieldCapacity,
				ramId: $fieldRam,
				colorId: $fieldColor,
				physicalGrading: $fieldPhysicalGrading,
				token,
			})
				.then(() => {
					isLoading = false;
					resolve();
				})
				.catch((error) => {
					isLoading = false;

					const { obj } = error.response.data;
					let text = $_('error.serverErrorMessage');
					if (obj === 'ERR_EXIST') {
						text = $_('device.device') + ' ' + $_('message.exists');
					}
					swal.fire({
						position: 'top',
						icon: 'error',
						title: $_('error.serverErrorTitle'),
						text: text,
						reverseButtons: true,
						customClass: {
							icon: 'icon-error',
						},
					});

					reject();
				});
		});
	};

	const validate = async (field) => {
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
			await addDevice();
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
			await goto('my-devices');
		} catch (error) {
			if (error) {
				errors = extractErrors(error);
				onErrors(errors);
			}
		}
	};
</script>

<form autocomplete="off" on:submit|preventDefault={handleSubmit} novalidate>
	<MobileBasicInfo {errors} />

	<h4 class="tc mt2rem mb1rem ttc" class:red={errors.physicalGrading}>
		{$_('device.physicalGrading')}
	</h4>
	{#if errors.physicalGrading}
		<div class="red fw6 mv3 tc" transition:fade>{errors.physicalGrading}</div>
	{/if}
	<div id="physicalGrading">
		<MobileGradeDevice />
	</div>
	{#if $infoImei}
		{#if $infoImei.other_detail}
			{#if !isObjectEmpty($infoImei.other_detail)}
				<details class="more-infomation mt5 mb5">
					<summary class="link tc light-blue u pointer fw6 mb3 mb5">
						{$_('device.moreInfo')}
					</summary>
					<div class="content-info">
						<div class="ba b--light-gray">
							{#each Object.entries($infoImei.other_detail) as [key, value], i}
								<div class="flex" class:bg-light-gray={i % 2 === 0}>
									<span class="pa3 b--light-gray fw6 mw150 br">{key}</span>
									<span class="pa3 b--light-gray flex-auto">{value}</span>
								</div>
							{/each}
						</div>
					</div>
				</details>
			{/if}
		{/if}
	{/if}
	{#if isLoading}
		<button
			type="button"
			class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-50-px fw6 w-100
				tracked mt1rem"
		>
			<div class="flex w-100 items-center justify-center">
				<LoadingDefault />
			</div>
		</button>
	{:else}
		<button
			type="submit"
			class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-50-px fw6 w-100
				tracked mt1rem"
		>
			{$_('device.createDevice')}
		</button>
	{/if}
</form>

<style>
	.mw150 {
		min-width: 150px;
	}
	summary:focus {
		outline: none;
	}
</style>
