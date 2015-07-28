'use strict';

var SegmentUpdate = function() {
    this.segmentIndex = options.segmentIndex;
    this.activeSynapses = options.activeSynapses;
    this.sequenceSegment = options.sequenceSegment || false;
};

module.exports = SegmentUpdate;
