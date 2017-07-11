// Global vars
var fullMode = false;
var showStag = false;
var showShock = false;

// Obtain and return inputs
function getInputs() {
	console.log("getting inputs");
	var gammaField = document.getElementById('gamma');
	var machField = document.getElementById('mach');
	var gammaVal = gammaField.value;
	var machVal = machField.value;
	if (isNaN(parseFloat(gammaVal)) || isNaN(parseFloat(machVal))) {
		alert('Error: must input numbers for gamma and Mach number');
		return
	}
	return [gammaVal, machVal];
}

// Isentropic relations
function calcTotalTemperature(gam,mach,tem) {
	var tratio = (1.0 + ((gam-1.0)/2.0)*mach**2)
	return tratio * tem;
}
function calcTotalDensity(gam,mach,dens) {
	var dratio = (1.0 + ((gam-1.0)/2.0)*mach**2)**(1.0/(gam-1.0));
	return dratio * dens;
}
function calcTotalPressure(gam,mach,press) {
	var pratio = (1.0 + ((gam-1.0)/2.0)*mach**2)**(gam/(gam-1.0));
	return pratio * press;
}

// Normal shock wave relations
function calcShockTemperature(gam,mach,tem) {
	var tratio = (1.0+((gam-1.0)/2.0)*mach**2)*((2.0*gam/(gam-1.0))*mach**2-1.0)/
		((mach**2)*((2.0*gam/(gam-1.0))+(gam-1.0)/2.0));
	return tratio * tem;
}

function calcShockDensity(gam,mach,dens) {
	var dratio = ((gam+1.0)*mach**2)/((gam-1.0)*mach**2+2.0)
	return dratio * dens;
}
function calcShockPressure(gam,mach,press) {
	var pratio = (2.0*gam*mach**2-(gam-1.0))/(gam+1.0)
	return pratio * press;
}

// toggles an element's display property
function displayToggle(trigger,elem,btn) {
	trigger = ! trigger;
	if ( trigger ) {
		elem.style.display = "block";
		btn.value = "hide";
	} else {
		elem.style.display = "none";
		btn.value = "show";
	}
	return trigger;
}

// Wrapper that gets all of the total properties given gamma and mach
function calcTotalProperties(gam,mach) {
	var ttemp = 0;
	var tdens = 0;
	var tpress = 0;
	ttemp = calcTotalTemperature(gam,mach,1.0);
	tdens = calcTotalDensity(gam,mach,1.0);
	tpress = calcTotalPressure(gam,mach,1.0);
	return [ttemp,tdens,tpress];
}

// Wrapper that gets all of the shock properties given gamma and mach
function calcShockProperties(gam,mach) {
	var stemp = 0;
	var sdens = 0;
	var spress = 0;
	stemp = calcShockTemperature(gam,mach,1.0);
	sdens = calcShockDensity(gam,mach,1.0);
	spress = calcShockPressure(gam,mach,1.0);
	sdens = calcShockDensity(gam,mach,1.0);
	spress = calcShockPressure(gam,mach,1.0);
	return [stemp,sdens,spress];
}

// Main program
document.addEventListener("DOMContentLoaded", function(){
	// button elements
	var computeBtn  = document.getElementById('compute');
	var modeBtn     = document.getElementById('more-button');
	var stagBtn     = document.getElementById('showStag');
	var shockBtn    = document.getElementById('showShock');
	// page elements
	var fullDiv      = document.getElementById('optionals');
	var fullResult   = document.getElementById('more-total-properties');
	var stagResults  = document.getElementById('stag-results');
	var shockResults = document.getElementById('shock-results');
	// fields
	var ttempField   = document.getElementById('ttemp');
	var tdensField   = document.getElementById('tdens');
	var tpressField  = document.getElementById('tpress');
	var stempField   = document.getElementById('stemp');
	var sdensField   = document.getElementById('sdens');
	var spressField  = document.getElementById('spress');
	// local vars
	var ttemp;
	var tdens;
	var tpress;
	var stemp;
	var sdens;
	var spress;
	// Calculate
	computeBtn.onclick = function() {
		[gamma,mach] = getInputs();
		[ttemp,tdens,tpress] = calcTotalProperties(gamma,mach);
		[stemp,sdens,spress] = calcShockProperties(gamma,mach);
		ttempField.value = ttemp.toFixed(2);
		tdensField.value = tdens.toFixed(2);
		tpressField.value = tpress.toFixed(2);
		stempField.value = stemp.toFixed(2);
		sdensField.value = sdens.toFixed(2);
		spressField.value = spress.toFixed(2);
	};

	// Toggle full display
	modeBtn.onclick = function() {
		fullMode = ! fullMode;
		if ( fullMode ) {
			fullDiv.style.display = "block";
			fullResult.style.display = "block";
			modeBtn.value = "simple";
		} else {
			fullDiv.style.display = "none";
			fullResult.style.display = "none";
			modeBtn.value = "full";
		}
	};

	// Show/hide total properties
	stagBtn.onclick = function() {
		showStag = displayToggle(showStag,stagResults,stagBtn);
	};

	// Show/hide shock wave results
	shockBtn.onclick = function() {
		showShock = displayToggle(showShock,shockResults,shockBtn);
	};

});
