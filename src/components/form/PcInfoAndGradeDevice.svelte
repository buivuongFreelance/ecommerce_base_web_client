<script>
	import { _ } from 'svelte-i18n';
	import PcBasicInfo from '../device/PcBasicInfo.svelte';
	import { stores, goto } from '@sapper/app';
	import PcGradeDevice from '../device/PcGradeDevice.svelte';
	import { extractError, extractErrors, isObjectEmpty } from '../../functions';
	import * as yup from 'yup';
	import { fade } from 'svelte/transition';
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
	import swal from 'sweetalert2';
	import 'sweetalert2/dist/sweetalert2.min.css';
	import LoadingDefault from '../loading/LoadingDefault.svelte';

	export let onErrors;
	const { session } = stores();
	const { domainDevice } = $session;

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
		let token = '';
		if ($auth) token = $auth.accessToken;

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

<style>
	.max-width-50 {
		max-width: 50%;
	}
	.mw150 {
		min-width: 150px;
	}
	summary:focus {
		outline: none;
	}
</style>

<form
	class="w-100"
	autocomplete="off"
	on:submit|preventDefault={handleSubmit}
	novalidate>
	<div class="flex b--light-gray br2 ba mt5">
		<div class="w-50 pr5 b--light-gray br pb5">
			<PcBasicInfo {errors} />
		</div>
		<div class="w-50 pl5 pr6 pb5">
			<h3 class="tc mv5 ttc" class:red={errors.physicalGrading}>
				{$_('device.physicalGrading')}
			</h3>
			<h5 class="mb3 light-silver" class:red={errors.physicalGrading}>
				{$_('device.selectPhGra')}
			</h5>
			{#if errors.physicalGrading}
				<div class="red fw6 mt2 mb2" transition:fade>
					{errors.physicalGrading}
				</div>
			{/if}
			<div id="physicalGrading">
				<PcGradeDevice />
			</div>
		</div>
	</div>

	{#if $infoImei}
		{#if $infoImei.other_detail}
			{#if !isObjectEmpty($infoImei.other_detail)}
				<details class="more-infomation mt5 ">
					<summary class="link tc light-blue u pointer fw6 mb3 mb5">
						{$_('device.moreInfo')}
					</summary>
					<div class="content-info flex justify-center">
						<div class="ba b--light-gray max-width-50">
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
	<div class="flex flex-column items-center w-30 mt5 center">
		{#if isLoading}
			<button
				type="button"
				class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-60-px fw6 w4
					tracked pointer">
				<div class="flex w-100 items-center justify-center">
					<LoadingDefault />
				</div>
			</button>
		{:else}
			<button
				type="submit"
				class="br2 bg-dark-blue b--dark-blue ba grow ttu white h-60-px fw6 w4
					tracked pointer">
				{$_('device.createDevice')}
			</button>
		{/if}
	</div>
</form>
