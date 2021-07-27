import { createStore } from 'vuex';

async function getData(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error('Something went wrong! Try again later.');

	const data = await res.json();
	if (!data.items) throw new Error('No results found.');

	console.log(data);
	return data;
}

function handleErrors(state, error) {
	// Rollback changes
	state.commit('updateSearchResults', { results: [], totalResults: 0, isNew: true });

	console.error(`💥Error💥:${error.message}`);
}

export default createStore({
	state: {
		searchQuery: '',

		searchResults: [],
		numOfResults: 0,
		page: 0,

		loading: true,
	},

	getters: {
		maxNumOfPages(state) {
			let max = Math.ceil(state.numOfResults / 10);
			return max > 10 ? 10 : max;
		},
	},

	mutations: {
		setSearchQuery(state, query) {
			state.searchQuery = query;
		},

		updateSearchResults(state, { results, totalResults, isNew }) {
			state.searchResults = results;
			state.numOfResults = +totalResults;
			isNew ? (state.page = 0) : (state.page = state.page);
			state.loading = false;
		},

		showLoadingBar(state) {
			state.loading = true;
		},

		navigatePages(state, direction) {
			if (direction === 'prev') {
				state.page--;
				return state.page < 0 ? (state.page = 0) : state.page;
			} else if (direction === 'next') {
				state.page++;
				return state.page >= state.maxNumOfPages ? state.maxNumOfPages : state.page;
			}
		},
	},

	actions: {
		async search(state, { url, isNew }) {
			try {
				// Show loading bar
				state.commit('showLoadingBar');

				// Get search results
				const {
					items: results,
					searchInformation: { totalResults },
				} = await getData(url);

				// Commit to state
				state.commit('updateSearchResults', { results, totalResults, isNew });
				//
			} catch (err) {
				handleErrors(state, err);
			}
		},
	},
});
