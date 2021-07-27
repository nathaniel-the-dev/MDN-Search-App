<template>
	<section class="results__section">
		<!-- Loading bar -->
		<img id="loading__img" src="https://media.tenor.com/images/a742721ea2075bc3956a2ff62c9bfeef/tenor.gif" alt="Loading Buffering GIF - Loading Buffering Spinning GIFs" v-if="loading" />

		<div class="results__container" :class="theme" v-if="searchResults.length">
			<h2 id="results__heading">Results for "{{ searchQuery }}"</h2>

			<ul class="results__list" ref="resultsList" v-show="!loading">
				<li class="result" v-for="(result, i) in searchResults" :key="i">
					<a class="result__link" :href="result.link" target="__blank"> {{ result.title }}</a>
					<p class="result__summary">{{ formattSnippet(result.htmlSnippet) }}</p>
				</li>
			</ul>
		</div>

		<h3 id="results__alert" v-else-if="!searchResults.length && !loading">No results found!</h3>
	</section>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';

	export default {
		name: 'Results',

		data() {
			return {
				theme: window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light',
			};
		},

		computed: { ...mapState(['searchQuery', 'searchResults', 'loading']), ...mapGetters(['maxNumOfPages']) },

		methods: {
			// Helpers
			formattSnippet(htmlString) {
				const parser = new DOMParser();
				const htmlDoc = parser.parseFromString(htmlString, 'text/html');
				const htmlContent = htmlDoc.querySelector('body').innerText;

				const [_, summary] = htmlContent.split(' ... ');

				return summary;
			},
		},

		watch: {
			loading() {
				if (this.$refs.resultsList) this.$refs.resultsList.scrollTop = 0;
			},
		},
	};
</script>

<style lang="scss">
	$main-bg-color: #0e1318;
	$main-color: #013d79;

	#loading__img {
		width: 5rem;

		position: absolute;
		inset: 50%;
		transform: translate(-50%, -50%);

		opacity: 0;

		animation: showSpinner 0.2s linear forwards;
		animation-delay: 0.5s;
	}

	@keyframes showSpinner {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.results__section {
		background: hsl(0, 0%, 95%);
		height: 100%;
	}

	#results__heading {
		background: hsl(0, 0%, 100%);
		margin: 0;
		padding: 10px;
	}

	.results__list {
		border: 1px solid black;

		margin: 0;
		padding: 15px 0 0 0;

		max-height: 70vh;
		overflow-y: auto;
		list-style: none;

		.result {
			border-bottom: 1px solid grey;
			margin: 5px 0;
			padding: 10px 0 0 0;

			.result__link {
				color: $main-color;
				font-family: 'Open Sans', Helvetica, sans-serif;

				&:focus {
					outline: 2px solid grey;
				}
			}

			.result__summary {
				margin: 0.5rem 0 1rem;
				padding: 0 6rem;
			}
		}

		& .result:last-child {
			border: none;
		}

		&::-webkit-scrollbar {
			width: 1rem;
		}
		&::-webkit-scrollbar-thumb {
			background: hsl(211, 25%, 35%);
			border: 4px solid white;
			border-radius: 1rem;

			&:hover {
				background: hsl(211, 25%, 25%);
			}

			&:active {
				background: hsl(211, 25%, 15%);
			}
		}
	}

	#results__alert {
		font-size: 2.5rem;

		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
