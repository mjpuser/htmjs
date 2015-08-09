var SP = require('../lib/spatial-pooler');
var TP = require('../lib/temporal-pooler');
var fs = require('fs');
var serializer = require('../lib/temporal-pooler/serializer');
/*var sp = new SP({
	columns: 200,
	inputs: 10,
	minOverlap: 3,
	medianSynapses: 15,
	desiredLocalActivity: 1
});
*/

var tpConfig = require('../tp');
//var tp = serializer.hydrate(tpConfig);
/*
var tp = new TP({
	columns: 200,
	cellsPerColumn: 3
});
*/



var inputs = [
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199],
[19,32,48,68,82,103,119,138,149,158,174,193],
[0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
[0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199]
];

var prediction = [];
inputs.forEach(function(sdr, i) {
	//var sdr = sp.getSDR(input);
	tp.setInput(sdr);
	var percent = sdr.reduce(function(sum, i) {
		return sum + ((prediction.indexOf(i) > -1) ? 1 : 0);
	}, 0) / (prediction.length || 1) * 100;
	console.log(Math.round(percent) + '%', sdr.toString(), 'should be ', prediction.toString());
	prediction = tp.predict();
});


//fs.writeFile('tp.json', JSON.stringify(serializer.dehydrate(tp)));
