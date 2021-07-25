<template>
	<section class="main__section" v-if="online">
		<section class="input__section" :class="{ minimized: !initialLoad }">
			<h1>Search for anything on MDN</h1>

			<form class="input__form" @submit.prevent="initiateSearch(true)">
				<input class="search__input" type="search" placeholder="Search MDN" autofocus v-model="query" />
				<button class="search__btn" type="submit" title="Search" tabindex="-1"><i class="bi bi-search"></i></button>
			</form>
		</section>

		<Results v-show="!initialLoad" :query="currentQuery" />

		<div class="page--controls">
			<button v-show="canLoadLess" @click="changePage('prev')">Previous</button>
			<p>Page {{ page + 1 }}</p>
			<button v-show="canLoadMore" @click="changePage('next')">Next</button>
		</div>
	</section>

	<h1 id="online__alert" v-else>You are not online. Connect to the internet to use.</h1>
</template>

<script>
	import Results from './components/Results.vue';
	import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

	export default {
		name: 'App',

		components: { Results },

		data() {
			return {
				query: '',
				currentQuery: '',

				initialLoad: true,
				online: navigator.onLine,
			};
		},

		computed: {
			formattedQuery() {
				return this.query.trim().toLowerCase();
			},
			canLoadMore() {
				return this.page < this.maxNumOfPages - 1;
			},
			canLoadLess() {
				return this.page > 0;
			},
			...mapState(['searchResults', 'page']),
			...mapGetters(['maxNumOfPages']),
		},

		methods: {
			async initiateSearch(isNew) {
				// Search for results
				//////////////////////////////// (Hide API key later)
				if (!this.formattedQuery) return;

				this.currentQuery = this.formattedQuery;
				await this.search({ url: `https://www.googleapis.com/customsearch/v1?q=${this.currentQuery}&start=${isNew ? 1 : this.page * 10 + 1}&filter=1&cx=2420320cb057782ec&key=AIzaSyBJbKmZIkraNQ2jO-p1B2-NwM1W5qc2KAc`, isNew });

				// Update UI
				this.initialLoad = false;
			},
			changePage(direction) {
				if (!this.formattedQuery) this.formattedQuery = this.currentQuery;

				this.navigatePages(direction);
				this.initiateSearch(false);
			},
			...mapMutations(['navigatePages']),
			...mapActions(['search']),
		},
	};
</script>

<style lang="scss">
	$main-bg-color: hsla(210, 26%, 7%, 0.85);
	$main-heading-color: #81abd4;
	$main-color: #a2c9f0;

	$searchbar-transition: all 0.5s ease;

	html,
	body {
		margin: 0;
		padding: 0;
		box-sizing: border-box;

		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased;
	}

	body {
		font-family: 'Open Sans', Helvetica, Arial, sans-serif;
		text-align: center;

		overflow: hidden;
	}

	#online__alert {
		position: absolute;
		inset: 50%;
	}

	.main__section {
		background: url(./assets/backdrop.png) no-repeat;
		background-size: cover;

		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;

		width: 100%;
		height: 100%;
	}

	.input__section {
		background: $main-bg-color;

		width: 100%;
		height: 100%;
		padding: 10rem 0;

		display: flex;
		flex-direction: column;
		align-items: center;

		transition: all 0.6s ease;

		h1 {
			color: $main-heading-color;
			margin: 3rem 0;
			font-size: 2rem;
		}

		&.minimized {
			height: 10vh;
			padding: 1rem 0;

			justify-content: center;

			h1 {
				display: none;
			}
		}
	}

	.input__form {
		background: rgb(8, 14, 19);
		border: 2px solid hsl(0, 0%, 60%);
		border-radius: 1rem;

		display: flex;

		transition: $searchbar-transition;

		.search__input {
			background: none;
			border: none;
			outline: none;

			color: $main-color;

			font-size: 1.25rem;
			text-align: center;

			padding: 0.5rem 10px;

			&::placeholder {
				color: inherit;
				opacity: 0.5;

				user-select: none;
			}
		}

		.search__btn {
			background: none;
			border: none;
			outline: none;

			display: flex;
			align-items: center;
			justify-content: center;

			i {
				font-size: 1.25rem;
				color: $main-color;
				opacity: 0.5;
				transition: $searchbar-transition;
			}

			cursor: pointer;
		}

		&:focus-within {
			border: 2px solid hsl(0, 0%, 90%);

			i {
				opacity: 1;
			}
		}
	}

	.page--controls {
		background: white;
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 5px;

		z-index: 1;

		p {
			margin: 0;
		}

		button {
			z-index: 1;
		}
	}
</style>
