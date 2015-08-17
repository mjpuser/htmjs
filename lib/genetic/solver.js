'use strict';

var Task = require('genetic').Task;

var inputs = require('../../test/inputs');
var TP = require('../temporal-pooler');

var pick = function(from, to) {
	return from + Math.floor(Math.random() * (to - from));
};
var getRandomSolution = function(cb) {
	cb({
		columnLength: 4000,
		cellsPerColumn: pick(1, 80),
		maxSegmentsPerCell: pick(1, 20),
		maxDendritesPerSegment: pick(10, 50),
		activationThreshold: pick(1, 20),
		minThreshold: pick(1, 20),
		dendriteSpan: pick(1, 100),
		permanenceDec: pick(0, 900) / 1000,
		permanenceInc: pick(0, 900) / 1000
	});
};

var fields = ['columns', 'cellsPerColumn', 'maxSegmentsPerCell', 'maxDendritesPerSegment', 'activationThreshold', 'minThreshold', 'dendriteSpan', 'permanenceDec', 'permanenceInc'];

var mutate = function(solution, callback) {
	var mutation;
	var clone = JSON.parse(JSON.stringify(solution));
	var cb = function(solution) {
		mutation = solution;
	};
	var mutatedField = fields[pick(0, fields.length)];
	getRandomSolution(cb);

	clone[mutatedField] = mutation[mutatedField];
	console.log(t.statistics);
	callback(clone);
};

var crossover = function(p1, p2, cb) {
	var child = {};
	fields.forEach(function(field) {
		child[field] = Math.round(Math.random()) ? p1[field] : p2[field];
	});
	return child;
};

var stopCriteria = function() {
	return this.generation == 100;
};

var fitness = function(solution, cb) {
	var scores = [];
	var prediction = [];
	var tp = new TP(solution);
	inputs.forEach(function(input) {
		tp.setInput(input);
		var totalCorrect = prediction.reduce(function(sum, val) {
			return sum + (~input.indexOf(val) ? 1 : 0);
		}, 0);
		var totalExtra = Math.max(0, prediction.length - totalCorrect);
		var correct = Math.round(totalCorrect / (prediction.length ? prediction.length : 1) * 100);
		var captured = Math.round(totalCorrect / input.length * 100);
		scores.unshift((correct * 1/2) + (captured * 1/2));
		prediction = tp.predictAndLearn();
		scores.length = Math.min(scores.length, 6);
	});


	var score = scores.reduce(function(sum, score) {
		return sum + score;
	}, 0) / scores.length;
	console.log('score', score);
	cb(score);
};

var options = {
	getRandomSolution : getRandomSolution  // previously described to produce random solution
  , popSize : 1000  // population size
  , stopCriteria : stopCriteria  // previously described to act as stopping criteria for entire process
  , fitness : fitness  // previously described to measure how good your solution is
  , minimize : false  // whether you want to minimize fitness function. default is `false`, so you can omit it
  , mutateProbability : 0.1  // mutation chance per single child generation
  , mutate : mutate  // previously described to implement mutation
  , crossoverProbability : 0.3 // crossover chance per single child generation
  , crossover : crossover // previously described to produce child solution by combining two parents
};

var t = new Task(options);
var s;
t.on('statistics', function(stats) {
	console.log(stats);
});
t.on('mutate', function() {
	console.log('MUTATION!');
});
t.on('child forming end', function (children) { console.log('child forming end',children) })
t.on('calcFitness end', function (pop) { console.log('calcFitness end', pop) })

t.run();
