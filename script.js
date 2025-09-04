const tickValues = { ES: 12.5, NQ: 20, YM: 5, GC: 10, CL: 10 };
const tickSize = { ES: 0.25, NQ: 0.25, YM: 1, GC: 0.1, CL: 0.01 };

let asset = null,
	stopType = 'ticks',
	stopValue = null,
	riskValue = null;

function toggleLang() {
	currentLang = currentLang === 'he' ? 'en' : 'he';
	document.documentElement.lang = currentLang;
	document.body.dir = currentLang === 'he' ? 'rtl' : 'ltr';
	document.getElementById('langBtn').innerText = currentLang === 'he' ? 'EN' : 'HE';
	renderUI();
}

function renderUI() {
	const t = translations[currentLang];
	document.getElementById('title').innerText = t.title;
	document.getElementById('pickAssetLabel').innerText = t.pickAsset;
	document.getElementById('stopTypeLabel').innerText = t.stopType;
	document.getElementById('stopDistanceLabel').innerText = t.stopDistance;
	document.getElementById('priceLabel').innerText = t.currentPrice;
	document.getElementById('riskAmountLabel').innerText = t.riskAmount;

	// Assets
	const assetBtns = t.assets
		.map((a) => `<button class="btn btn-outline-primary" onclick="setAsset('${a}')">${a}</button>`)
		.join('');
	document.getElementById('assetButtons').innerHTML = assetBtns;

	// Stop types
	const stopBtns = Object.entries(t.stopTypes)
		.map(([key, val]) => `<button class="btn btn-outline-secondary" onclick="setStopType('${key}')">${val}</button>`)
		.join('');
	document.getElementById('stopTypeButtons').innerHTML = stopBtns;

	// Quick buttons
	const stopQuick = [20, 25, 30, 40, 50]
		.map((v) => `<button class="btn btn-outline-info" onclick="setStopDistance(${v})">${v}</button>`)
		.join('');
	document.getElementById('stopQuickButtons').innerHTML = stopQuick;

	const riskQuick = [200, 300, 500]
		.map((v) => `<button class="btn btn-outline-success" onclick="setRisk(${v})">$${v}</button>`)
		.join('');
	document.getElementById('riskQuickButtons').innerHTML = riskQuick;

	update();
}

function setAsset(a) {
	asset = a;
	update();
}
function setStopType(type) {
	stopType = type;
	document.getElementById('priceBox').style.display = type === 'percent' ? 'block' : 'none';
	update();
}
function setStopDistance(v) {
	document.getElementById('stopInput').value = v;
	stopValue = v;
	update();
}
function setRisk(v) {
	document.getElementById('riskInput').value = v;
	riskValue = v;
	update();
}

function update() {
	const t = translations[currentLang];
	stopValue = parseFloat(document.getElementById('stopInput').value) || stopValue;
	riskValue = parseFloat(document.getElementById('riskInput').value) || riskValue;

	if (!asset || !stopValue || !riskValue) {
		document.getElementById('result').innerText = t.selectInputs;
		return;
	}

	let ticks = 0;
	if (stopType === 'ticks') {
		ticks = stopValue;
	} else if (stopType === 'points') {
		ticks = stopValue / tickSize[asset];
	} else if (stopType === 'percent') {
		let price = parseFloat(document.getElementById('priceInput').value);
		if (!price) {
			document.getElementById('result').innerText = t.enterPrice;
			return;
		}
		let stopInPrice = price * (stopValue / 100);
		ticks = stopInPrice / tickSize[asset];
	}

	let riskPerContract = ticks * tickValues[asset];
	let miniContracts = riskValue / riskPerContract;
	let microContracts = miniContracts * 10;

	document.getElementById('result').innerText = `Mini Contracts: ${miniContracts.toFixed(
		2
	)}\nMicro Contracts: ${microContracts.toFixed(0)}`;
}

renderUI();
