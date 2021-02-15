chrome.runtime.onInstalled.addListener(function () {
	console.log('Loaded' + new Date());

	chrome.runtime.onMessage.addListener(function (message, callback) {
		if (message == 'changeColor') {
			chrome.tabs.executeScript({
				code: 'document.body.style.backgroundColor="green"',
			});
		}
	});
});
