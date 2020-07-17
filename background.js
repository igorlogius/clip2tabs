
const extId = 'tabs2clip';
const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*/gm;

async function onBrowserActionClicked() { 

	let notify_title = '';
	let notify_message = '';

	try {

		const str = await navigator.clipboard.readText();
		let m;

		let matchFound=false;
		while ((m = regex.exec(str)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			// The result can be accessed through the `m`-variable.
			m.forEach((match, groupIndex) => {
				console.log(`Found match, group ${groupIndex}: ${match}`);

				if(groupIndex === 0) { // group 0 is the full match
					browser.tabs.create({
						active: false,
						discarded: true,
						url: match 
					});
					matchFound=true;
				}
			});
		}


		if(matchFound === true){
			notify_title = "Successfully opend urls from clipboard";
			notify_message = "The tabs are loaded as discared so it should not slow down your browser";
		}else{
			throw `no url found in clipboard which match ${regex}` 
		}


	} catch(e) {
		notify_title = 'Failed to open clipboard urls';
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

