let fs = require('fs');
const path = require('path');

const appDataPath = process.env.APPDATA;
const scriptsPath = '/Firebot/firebot-data/user-settings/scripts/';
const creditFolder = 'credits';
const dataFolder = "data";
const platysIncFolder = 'pm.includes';

const sponsors = require(path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/settings")).sponsors;
const images = require(path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/settings")).images;
const finalImage = require(path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/settings")).finalImage;
const finalText = require(path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/settings")).finalText;
const sectionTitles = require(path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/settings")).sectionTitles;
const tracking = require(path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/settings")).tracking;

exports.getScriptManifest = () => {
	return {
		name: "Credits",
		description: "Creates credits for stream.",
		version: "1",
		author: "PlatypusMuerte",
		website: "https://twitter.com/PlatypusMuerte"
	};
};

function clearFolders(username) {
	let folders = ["bans", "donos", "follows", "hosts", "mods", "raiders", "subs"];
	let cnt = 0;

	return new Promise((resolve, reject) => {
		folders.forEach(folder => {
			let nameDir = path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/" + dataFolder + "/" + folder + "/");

			fs.readdir(nameDir,(err,files) => {
				files.forEach(file => {
					removeFile(nameDir + file);
				});

				++cnt;
			});

			if(cnt >= folders.length) {
				resolve({
					success: true,
					effects: [
						{
							type: EffectType.CHAT,
							message: "Cleared dirs",
							chatter: "Streamer",
							whisper: username
						}
					]
				})
			}
		});
	});
}

function removeFile(file) {
	return new Promise((resolve, reject) => {
		fs.unlink(file, (err) => {
			if(err) {
				resolve({success: false, err: err});
			} else {
				resolve({success: true});
			}
		});
	});
}

function addName(type, name, replyTo, confirm) {
	return new Promise((resolve, reject) => {
		let userFile = path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/" + dataFolder + "/" + type + "/" + name + ".txt");

		let posResp = {
			success: true,
			effects: [
				{
					type: EffectType.CHAT,
					message: name + " added",
					chatter: "Streamer",
					whisper: replyTo
				}
			]
		};

		let negResp = {
			success: true,
			effects: [
				{
					type: EffectType.CHAT,
					message: name + " already exists",
					chatter: "Streamer",
					whisper: replyTo
				}
			]
		};

		let noResp = {
			success: true
		};

		getNameList(type).then((resp) => {
			if(resp.includes(name.toLowerCase())) {
				resolve((confirm ? negResp:noResp));
			} else {
				fs.closeSync(fs.openSync(userFile, 'w'));
				resolve(((confirm) ? posResp:noResp));
			}
		});
	});
}

function getNameList(type) {
	return new Promise((resolve, reject) => {
		let nameFiles = [];
		let userDir = path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/" + dataFolder + "/" + type + "/");

		fs.readdir(userDir,(err,files) => {
			files.sort();
			files.forEach(file => {
				nameFiles.push(file.replace('@',"").replace(/\.txt/,""));
			});

			resolve(nameFiles);
		});
	});
}

function getNamesFromFile(params) {
	return new Promise((resolve, reject) => {
		let names = [];

		if(params.collect) {
			getNameList(params.file).then(fileNames => {
				resolve(fileNames)
			});
		} else {
			resolve(names);
		}
	});
}

function getHead() {
	let fileContent;
	let file = path.join(appDataPath,scriptsPath + "/" + platysIncFolder + "/" + creditFolder + "/credits.css");

	return new Promise((resolve, reject) => {

		fs.readFile(file,(err,data) => {
			if(err) {
				fileContent = err;
			} else {
				fileContent = data;
			}

			resolve(`<style>` + fileContent + `</style>`);
		});
	});
}

function getJS(totalNameCnt) {
	let timeToScroll;

	if(totalNameCnt > 500) {
		timeToScroll = 210000;
	} else if(totalNameCnt > 400) {
		timeToScroll = 180000;
	} else if(totalNameCnt > 300) {
		timeToScroll = 150000;
	} else if(totalNameCnt > 200) {
		timeToScroll = 120000;
	} else if(totalNameCnt > 100) {
		timeToScroll = 90000;
	} else {
		timeToScroll = 60000;
	}

	return `<div class="credits-script-throwawaydiv"></div><script>
		let totalHeight = 0;
		$("#creditsWrapper").children().each(function(){
    		totalHeight = totalHeight + $(this).outerHeight(true);
		});
		$('.creditsWrapper').animate({top: "-=" + totalHeight + "px"}, ` + timeToScroll + `);
	</script>`;
}

function getHTML(creditNames) {
	let resp = `<div id="creditsWrapper" class="creditsWrapper"><div class="creditsthrowawaydiv"></div><div class="creditsList">`;
		resp += makeTitle();
		resp += makeSponsors(creditNames.sponsors);
		resp += makeSubs(creditNames.subs);
		resp += makeDonos(creditNames.donos);
		resp += makeFollows(creditNames.follows);
		resp += makeHosts(creditNames.hosts);
		resp += makeRaids(creditNames.raids);
		resp += makeMods(creditNames.mods);
		resp += makeBans(creditNames.bans);
		resp += makeImageFooter();
		resp += `</div></div>`;

	return resp;
}

function makeTitle() {
	return `<div class="creditsTitle">`+sectionTitles.main+`</div>`;
}

function makeSubs(subs) {
	let html = `<div class="creditsSubTitle">`+sectionTitles.subs+`</div>`;

	if(subs.length > 0) {
		html += `<div class="creditsSubGroup">`;

		subs.forEach(sub => {
			html += `<div class="creditsSub">` + sub + `</div>`;
		});

		html += `</div>`;

		return html;
	} else {
		return "";
	}
}

function makeDonos(donos) {
	let html = `<div class="creditsDonoTitle">`+sectionTitles.donos+`</div>`;

	if(donos.length > 0) {
		html += `<div class="creditsDonoGroup">`;

		donos.forEach(dono => {
			html += `<div class="creditsDono">` + dono + `</div>`;
		});

		html += `</div>`;

		return html;
	} else {
		return "";
	}
}

function makeFollows(follows) {
	let html = `<div class="creditsFollowTitle">`+sectionTitles.follows+`</div>`;

	if(follows.length > 0) {
		html += `<div class="creditsFollowGroup">`;

		follows.forEach(follow => {
			html += `<div class="creditsFollow">` + follow + `</div>`;
		});

		html += `</div>`;

		return html;
	} else {
		return "";
	}
}

function makeHosts(hosts) {
	let html = `<div class="creditsHostTitle">`+sectionTitles.hosts+`</div>`;

	if(hosts.length > 0) {
		html += `<div class="creditsHostGroup">`;

		hosts.forEach(host => {
			html += `<div class="creditsHost">` + host + `</div>`;
		});

		html += `</div>`;

		return html;
	} else {
		return "";
	}
}

function makeRaids(raids) {
	let html = `<div class="creditsSubTitle">`+sectionTitles.raids+`</div>`;

	if(raids.length > 0) {
		html += `<div class="creditsRaidGroup">`;

		raids.forEach(raid => {
			html += `<div class="creditsRaid">` + raid + `</div>`;
		});

		html += `</div>`;

		return html;
	} else {
		return "";
	}
}

function makeMods(mods) {
	let html = `<div class="creditsModTitle">`+sectionTitles.mods+`</div>`;

	if(mods.length > 0) {
		html += `<div class="creditsModGroup">`;

		mods.forEach(mod => {
			html += `<div class="creditsMod">` + mod + `</div>`;
		});

		html += `</div>`;

		return html;
	} else {
		return "";
	}
}

function makeBans(bans) {
	let html = `<div class="creditsBanTitle">`+sectionTitles.bans+`</div>`;

	if(bans.length > 0) {
		html += `<div class="creditsBanGroup">`;

		bans.forEach(ban => {
			html += `<div class="creditsBan">` + ban + `</div>`;
		});

		html += `</div>`;

		return html;
	} else {
		return "";
	}
}

function makeSponsors(sponsors) {
	let html = `<div class="creditsBanTitle">`+sectionTitles.sponsors+`</div>`;

	if(sponsors.length > 0) {
		html += `<div class="creditsBanGroup">`;

		sponsors.forEach(sponsor => {
			html += `<div class="creditsBan">` + sponsor + `</div>`;
		});

		html += `</div>`;

		return html;
	} else {
		return "";
	}
}

function makeImageFooter() {
	let html = '<div class="creditsFooterImages">';

	images.forEach(path => {
		html += '<div class="creditsFooterImage"><img src="'+path.img+'" />';

		if(path.txt) {
			html += '<span>'+path.txt+'</span>';
		}

		html += '</div>';
	});

	html += '</div><div class="creditsFinale"><div class="creditsEndTitle">'+finalText+'</div><img src="'+finalImage+'" /></div>';

	return html;
}

function buildCredits() {
	let totalNameCnt = 0;
	let creditNames = {
		bans: [],
		donos: [],
		follows: [],
		hosts: [],
		mods: [],
		raids: [],
		subs: [],
		sponsors: sponsors
	};

	return new Promise((resolve, reject) => {
		getNamesFromFile({collect: (tracking.bans), file: "bans"}).then(bans => {
			creditNames.bans = bans;
			totalNameCnt += bans.length;

			getNamesFromFile({collect: (tracking.donos), file: "donos"}).then(donos => {
				creditNames.donos = donos;
				totalNameCnt += donos.length;

				getNamesFromFile({collect: (tracking.follows), file: "follows"}).then(follows => {
					creditNames.follows = follows;
					totalNameCnt += follows.length;

					getNamesFromFile({collect: (tracking.hosts), file: "hosts"}).then(hosts => {
						creditNames.hosts = hosts;
						totalNameCnt += hosts.length;

						getNamesFromFile({collect: (tracking.mods), file: "mods"}).then(mods => {
							creditNames.mods = mods;
							totalNameCnt += mods.length;

							getNamesFromFile({collect: (tracking.raids), file: "raiders"}).then(raids => {
								creditNames.raids = raids;
								totalNameCnt += raids.length;

								getNamesFromFile({collect: (tracking.subs), file: "subs"}).then(subs => {
									creditNames.subs = subs;
									totalNameCnt += subs.length;

									getHead().then((css) => {
										resolve({
											success: true,
											effects: [
												{
													type: EffectType.HTML,
													enterAnimation: "none",
													exitAnimation: "none",
													html: css + getHTML(creditNames),
													length: 5,
													removal: "creditsthrowawaydiv"
												},{
													type: EffectType.DELAY,
													delay: 3
												},{
													type: EffectType.HTML,
													enterAnimation: "none",
													exitAnimation: "none",
													html: getJS(totalNameCnt),
													length: 5,
													removal: "credits-script-throwawaydiv"
												}
											]
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
}

function run(runRequest) {
  let cmd = (runRequest.command && runRequest.command.args.length) ? runRequest.command.args[0]:false;
  let username = runRequest.user.name.toLowerCase();
  let replyTo = (runRequest.command.args[3]) ? runRequest.command.args[3]:false;
  let confirm = (runRequest.command.args[4]);
  
	return new Promise((resolve, reject) => {
		if(cmd && cmd === "clear") {
			clearFolders(username).then((resp) => {
				resolve(resp);
			});
		} else if(cmd && cmd === "add") {
			addName(runRequest.command.args[1], runRequest.command.args[2], replyTo, confirm).then((resp) => {
				resolve(resp);
			});
		} else {
			buildCredits().then((resp) => {
				resolve(resp);
			});
		}
	});
}

exports.run = run;