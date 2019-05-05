/**
 * Electron Boilerplate
 * 
 * @author Bavamont
 * @link https://github.com/bavamont
 */

/** 
 * Load from from settings.json
 */
document.title = settings.get("appName");
document.getElementById("loading").innerHTML = i18n.__("Loading...");

/** 
 * Set initial values.
 */
var initView = false;

/**
 * Show the app view.
 */
function showAppView() {
	if (!initView) initView = true;	
	/**
	 * Hide other views
	 * for example: $("#helpView").hide();
	 */
	$("#appView").show();
}

/**
 * Change console text.
 */
function printToConsole(text) {
	$("#console").html(text);
}

$(document).ready(function(){
	$("#splashScreen").delay(1500).hide(0, () => {
		$("#navbar").show(0);	
		$("#main").show(0);
		$(".footer").show(0);

		/**
		 * Translate app.html content.
		 */
		$("#showAppView").html(i18n.__($("#showAppView").html()));
		$("#exitView").html(i18n.__($("#exitView").html()));
		$("#loading").html(i18n.__($("#loading").html()));

		/**
		 * OnClick
		 */
		$("#showAppView").click(() => {
			showAppView();
		});
		
		$("#exitView").click(() => {
			closeWindow();
		});

		$("#minimizeWindow").click(() => {
			minimizeWindow();
		});

		$("#maximizeWindow").click(() => {
			maximizeWindow();
		});
		
		$("#closeWindow").click(() => {
			closeWindow();
		});

		printToConsole(i18n.__("Electron Boilerplate started."));
		showAppView();
	});
});

function maximizeWindow() {
	ipcRenderer.send('maximize-window');
}

function minimizeWindow() {
	ipcRenderer.send('minimize-window');
}

function closeWindow() {
	ipcRenderer.send('close-window');
}