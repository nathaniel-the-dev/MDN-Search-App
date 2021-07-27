module.exports = {
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			contextIsolation: false,

			builderOptions: {
				productName: 'Search MDN',
				appId: 'Search MDN',
				icon: 'public/favicon.ico',
				copyright: 'Copyright © 2021 Nathaniel Campbell',
			},
		},
	},
};
