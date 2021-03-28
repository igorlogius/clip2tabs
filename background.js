
const extId = 'tabs2clip';
const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*/gm;
//const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gm;


async function onBrowserActionClicked() { 


	let notify_title = '';
	let notify_message = '';

	let maxOpened = 99;
	let first=true;
	let tmp;

		tmp = await browser.storage.local.get("switch-to-first");
		switchToFirst = (typeof tmp["switch-to-first"] === 'undefined')? false: tmp["switch-to-first"];

		tmp = await browser.storage.local.get("load-activ");
		loadactiv = (typeof tmp["load-activ"] === 'undefined')? false: tmp["load-activ"];
		console.log('load-activ', loadactiv);
		
		tmp = await browser.storage.local.get("replace-activ");
		replaceActiv = (typeof tmp["replace-activ"] === 'undefined')?false: tmp["replace-activ"];
	
	
	try {
		tmp = await browser.storage.local.get("max-opened");
		maxOpened = parseInt(tmp["max-opened"]) ;
	}catch(err) {
	}

	try {

		const str = await navigator.clipboard.readText();

		//console.log(str);


		let m;

		let matchFound=false;
		while ((m = regex.exec(str)) !== null ) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			// The result can be accessed through the `m`-variable.
			m.forEach((match, groupIndex) => {
				//console.log(`Found match, group ${groupIndex}: ${match}`);

				if(maxOpened <= 0) { return; }

				if(groupIndex === 0) { // group 0 is the full match

					if(first && replaceActiv) {
						browser.tabs.update({active: true, url: match});
					}else{
						browser.tabs.create({
							active: (first && switchToFirst),
							discarded: !(first && switchToFirst) && !loadactiv,
							url: match 
						});
					}
					matchFound=true;
					maxOpened--;
					if(first) {
						first=false;
					}
				}
			});
		}


		if(!matchFound){
			throw `no url found in clipboard which match ${regex}` 
		}


	} catch(e) {
		notify_title = 'Failed to open clipboard urls';
		notify_message = e;

		browser.notifications.create(extId, {
			"type": "basic",
			"iconUrl": browser.runtime.getURL("icon.png"),
			"title": notify_title, 
			"message":  notify_message 
		});
	}

}

// register listener
browser.browserAction.onClicked.addListener(onBrowserActionClicked); 

