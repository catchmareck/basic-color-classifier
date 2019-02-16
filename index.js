'use strict';

const ColorClassifier = require('./utils/color-classifier');
const createTrainingData = require('./utils/create-training-data');

const [,, build] = process.argv;

if (!!build && build === '--build') {
    
    createTrainingData();
} else {

    const cc = new ColorClassifier();
    cc.predictColors();
}
