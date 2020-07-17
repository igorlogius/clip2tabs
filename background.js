
const extId = 'tabs2clip';
const excluded_urls = ['chrome','moz','about','data','blob'];
const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const regex = new RegExp(exp);

async function onBrowserActionClicked() { 

	console.log('onBrowserActionClicked');
	let notify_title = '';
	let notify_message = '';

	try {

		const clipText = await navigator.clipboard.readText();
		console.log('clipText', clipText);

		let match=false;
		clipText.trim().split('\n').forEach( (line) => {

			line = line.trim();

			// check if line is valid url
			if(line.match(regex)) {
				match=true;
				browser.tabs.create({
					active: false,
					discarded: true,
					url: line
				});

			}


		});


		if(match === true){
			notify_title = "Successfully copied urls to clipboard";
			notify_message = "Use CTRL+V <PASTE> to insert them into any notepad or editor";
		}else{
			throw 'url list empty, please note, that urls starting with "'+ excluded_urls.join('", "') + '" will be ignored';
		}


	} catch(e) {
		notify_title = 'Failed to copy urls to clipboard';
		notify_message = e.message;
	}

	browser.notifications.create(extId, {
		"type": "basic",
		"iconUrl": browser.runtime.getURL("icon.png"),
		"title": notify_title, 
		"message":  notify_message 
	});
}

// register listener
browser.browserAction.onClicked.addListener(onBrowserActionClicked); 

