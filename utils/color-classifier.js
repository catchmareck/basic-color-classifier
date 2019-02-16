'use strict';

const fs = require('fs');
const PNG = require('png-js');
const config = require('../config');

class ColorClassifier {

    constructor () {
        
        this.inputs = [];
        this.outputs = [];
        
        this.loadFeatures();
    }

    loadFeatures() {

        let features = '';
        try {

            features = fs.readFileSync(config.trainingDataFile, 'utf8');
        } catch (e) {
            
            console.log('Could not load training.data file. Run with `--build` first. Exiting...');
            
            process.exit(1);
        }
        
        features = features.split('\n');

        features.forEach((feature) => {

            const [r, g, b, output] = feature.split(',');

            this.inputs.push([r, g, b]);
            this.outputs.push(output);
        });
    }

    predictColors() {

        const images = fs.readdirSync(config.testDatasetDir, { encoding: 'utf8' });
        images.forEach((image) => {

            if (!image.endsWith('.png')) {

                console.log(`File ${image} doesn't seem to be PNG file. Skipping...`);
                return;
            }

            PNG.decode(`${config.testDatasetDir}/${image}`, (pixels) => {

                const [r, g, b] = pixels;
                const sample = [r, g, b];

                console.log(`${image}:`, this.knn(config.K, sample));
            });
        });
    }

    knn(k, sample) {

        const distances = [];

        this.inputs.forEach((input) => distances.push([this._euclideanDistance(sample, input), input]));

        const kNearest = distances.sort((a,b) => {

            if (a[0] < b[0]) return -1;
            else if (a[0] > b[0]) return 1;

            return 0;
        }).slice(0, k).map((nearest) => nearest[1]);

        const nearestLabels = [];

        kNearest.forEach((nearest) => {

            const index = this.inputs.findIndex((input) => this._vectorsEqual(input, nearest));
            nearestLabels.push(this.outputs[index]);
        });

        const predictionMap = nearestLabels.reduce((res, label) => {

            res[label] = res[label] || 0;
            res[label]++;

            return res;
        }, {});

        return Object.entries(predictionMap).sort((a, b) => {

            if (a[1] < b[1]) return 1;
            else if (a[1] > b[1]) return -1;

            return 0;
        })[0][0];
    }

    _euclideanDistance(vector1, vector2) {

        const squareDiffs = [];

        vector1.forEach((num, i) => squareDiffs.push(Math.pow(num - vector2[i], 2)));

        return Math.sqrt(this._sum(...squareDiffs));
    }

    _sum(...numbers) {

        return numbers.reduce((res, num) => res + num, 0);
    }

    _vectorsEqual(vector1, vector2) {

        for (let i = 0; i < vector1.length; i++) {

            if (vector1[i] !== vector2[i]) return false;
        }

        return true;
    }
}

module.exports = ColorClassifier;
