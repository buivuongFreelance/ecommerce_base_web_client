<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import ContentLoader from 'svelte-content-loader';
	import { listRam as apiListRam } from '../../services/model';

	export let selectedRams = [];

	const { session } = stores();
	const { domainModel } = $session;

	let isLoading = false;
	let isServer = false;
	export let rams = [];

	onMount(async () => {
		if (rams.length === 0) {
			rams = await getCapacity();
		}
	});

	const getCapacity = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiListRam(domainModel)
				.then((list) => {
					isLoading = false;
					isServer = false;
					resolve(list);
				})
				.catch((error) => {
					isServer = true;
					isLoading = false;
					reject(error);
				});
		});
	};
</script>

<style>
	.ram:not(:last-child) {
		margin-right: 10px;
	}
	.ram .box {
		height: 60px;
		line-height: 60px;
		min-width: 60px;
		box-sizing: border-box;
		border: 1px solid #e0e6ef;
	}
	.ram > input:checked + .box {
		border-color: #2f3a97;
		color: #2f3a97;
	}
</style>

{#if isServer}
	<p class="red f5">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="type"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={270}
		height="40">
		<rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
	</ContentLoader>
{:else}
	<div class="accordion">
		<div
			class="accordion-header h-60-px flex items-center bb b--light-gray mb3">
			<h4 class="accordion-title flex-auto">
				{$_('device.ram')}
				({$_('label.GB')})
			</h4>
		</div>
		<div class="accordion-body">
			{#if rams.length === 0}
				<p class="mv4 fw5">{$_('message.noItems')}</p>
			{:else}
				<div class="rams flex flex-wrap">
					{#each rams as ram}
						<label class="ram mb3">
							<input
								type="checkbox"
								bind:group={selectedRams}
								value={ram.id}
								class="dn" />
							<b class="box db tc ph3 fw6 br2">{ram.value}</b>
						</label>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
