<script>
	import { _ } from 'svelte-i18n';
	import { stores } from '@sapper/app';
	import { getFaqs as apiGetFaqs } from '../../services/model';
	import ContentLoader from 'svelte-content-loader';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { derived } from 'svelte-persistent-store/dist/local';

	const { session } = stores();
	const { domainModel } = $session;

	let isLoading = false;
	let isServerError = false;

	let faqs = [];

	let accordion;
	let selected = null;

	onMount(async () => {
		faqs = await getFaqs();
	});

	const getFaqs = () => {
		isLoading = true;
		return new Promise((resolve, reject) => {
			apiGetFaqs(domainModel)
				.then((obj) => {
					isServerError = false;
					isLoading = false;
					resolve(obj);
				})
				.catch((error) => {
					isServerError = true;
					isLoading = false;
					reject(error);
				});
		});
	};
</script>

<style>
	p {
		line-height: 1.5;
	}

	.accordion__header:after {
		content: '+';
		margin-left: auto;
		padding-left: 10px;
	}
	.accordion__header.active:after {
		content: '-';
	}
</style>

<h2 class="mb5">FAQs</h2>
{#if isServerError}
	<p class="red f5">{$_('error.serverErrorMessage')}</p>
{:else if isLoading}
	<ContentLoader
		uniqueKey="tabletCategory"
		primaryColor="#e4e6ef"
		secondaryColor="#f8f8f8"
		width={768}
		height="300">
		<rect x="0" y="0" rx="3" ry="3" width="50%" height="20" />
		<rect x="0" y="30" rx="3" ry="3" width="100%" height="20" />
		<rect x="0" y="60" rx="3" ry="3" width="100%" height="20" />

		<rect x="0" y="100" rx="3" ry="3" width="30%" height="20" />
		<rect x="0" y="130" rx="3" ry="3" width="100%" height="20" />
		<rect x="0" y="160" rx="3" ry="3" width="100%" height="20" />

		<rect x="0" y="200" rx="3" ry="3" width="30%" height="20" />
		<rect x="0" y="230" rx="3" ry="3" width="100%" height="20" />
		<rect x="0" y="260" rx="3" ry="3" width="100%" height="20" />
	</ContentLoader>
{:else}
	<div class="custom">
		{#if faqs.length > 0}
			{#each faqs as faq}
				<div class="accordion mb3">
					<div
						on:click={() => (selected = faq)}
						class:active={selected && selected.id === faq.id}
						class="accordion__header flex f4 fw6 pv3 ph4 bg-light-gray ba b--light-gray pointer">
						<span class="">{faq.question}</span>
					</div>
					{#if selected}
						{#if selected.id === faq.id}
							<div
								class="accordion__body bb bl br b--light-gray pa4"
								transition:fade>
								<p>{faq.answer}</p>
							</div>
						{/if}
					{/if}
				</div>
			{/each}
		{/if}
	</div>
{/if}
