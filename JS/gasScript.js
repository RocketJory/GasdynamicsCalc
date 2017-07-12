//--------------------------------------------------------
// GLOBAL VARIABLES
//--------------------------------------------------------
var fullMode = false;
var showStag = false;
var showShock = false;

//--------------------------------------------------------
// READING
//--------------------------------------------------------

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

// Obtain and return optional inputs
function getOptInputs() {
	console.log("getting optional inputs");
	var tempField  = document.getElementById('temp');
	var densField  = document.getElementById('dens');
	var pressField = document.getElementById('press');
	var tempVal = tempField.value;
	var densVal = densField.value;
	var pressVal = pressField.value;
	return [tempVal, densVal, pressVal];
}

//----------------------------------------------------------
// Isentropic relations
//----------------------------------------------------------
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

//-----------------------------------------------------------
// Normal shock relations
//-----------------------------------------------------------
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
	var pratio = ((2.0*gam*mach**2)-(gam-1.0))/(gam+1.0)
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

//----------------------------------------------------------
// Compressible gasdynamic Equation wrappers
//----------------------------------------------------------
// Wrapper that gets all of the total properties given gamma and mach
function calcTotalRatios(gam,mach) {
	var ttemp = 0;
	var tdens = 0;
	var tpress = 0;
	ttemp = calcTotalTemperature(gam,mach,1.0);
	tdens = calcTotalDensity(gam,mach,1.0);
	tpress = calcTotalPressure(gam,mach,1.0);
	return [ttemp,tdens,tpress];
}

// Wrapper that gets all of the shock properties given gamma and mach
function calcShockRatios(gam,mach) {
	var stemp = 0;
	var sdens = 0;
	var spress = 0;
	stemp = calcShockTemperature(gam,mach,1.0);
	sdens = calcShockDensity(gam,mach,1.0);
	spress = calcShockPressure(gam,mach,1.0);
	return [stemp,sdens,spress];
}

// Wrapper that gets the total values given gamma, mach, temp, dens and press
function calcTotalValues(gam,mach,temp,dens,press) {
	var temp0 = 0;
	var dens0 = 0;
	var press0 = 0;
	temp0 = calcTotalTemperature(gam,mach,temp);
	dens0 = calcTotalDensity(gam,mach,dens);
	press0 = calcTotalPressure(gam,mach,press);
	return [temp0,dens0,press0];
}

//--------------------------------------------------------------
// MAIN PROGRAM
//--------------------------------------------------------------
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
	// FIELDS
	// Stagnation ratios
	var ttempField   = document.getElementById('ttemp');
	var tdensField   = document.getElementById('tdens');
	var tpressField  = document.getElementById('tpress');
	// Stagnation values
	var ttempValField = document.getElementById('T0');
	var tdensValField = document.getElementById('d0');
	var tpressValField = document.getElementById('P0');
	// Shock Ratios
	var stempField   = document.getElementById('stemp');
	var sdensField   = document.getElementById('sdens');
	var spressField  = document.getElementById('spress');
	// local vars
	var ttemp;
	var tdens;
	var tpress;
	var temp0;
	var dens0;
	var press0;
	var stemp;
	var sdens;
	var spress;
	// Calculate
	computeBtn.onclick = function() {
		[gamma,mach] = getInputs();
		[ttemp,tdens,tpress] = calcTotalRatios(gamma,mach);
		[stemp,sdens,spress] = calcShockRatios(gamma,mach);
		ttempField.value  = ttemp.toFixed(2);
		tdensField.value  = tdens.toFixed(2);
		tpressField.value = tpress.toFixed(2);
		stempField.value  = stemp.toFixed(2);
		sdensField.value  = sdens.toFixed(2);
		spressField.value = spress.toFixed(2);
		// Compute stagnation values if full mode is on
		if (fullMode === true) {
			[temp0,dens0,press0] = getOptInputs();
			[temp0,dens0,press0] = calcTotalValues(gamma,mach,temp0,dens0,press0);
			ttempValField.value  = temp0.toFixed(2);
			tdensValField.value  = dens0.toFixed(2);
			tpressValField.value = press0.toFixed(2);
		};
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
		};
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
