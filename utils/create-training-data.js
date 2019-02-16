'use strict';

const fs = require('fs');
const PNG = require('png-js');
const config = require('../config');

function createTrainingData() {

    const dirs = getTrainingDirs();
    dirs.forEach((dir) => {

        const images = getImages(dir);
        images.forEach((image) => {

            if (!image.endsWith('.png')) {
                
                console.log(`File ${image} doesn't seem to be PNG file. Skipping...`);
                return;
            }

            getRGB(dir, image, (inputVector) => {

                fs.appendFileSync(config.trainingDataFile, `${inputVector.join(',')},${dir}\n`);
            });
        });
    });
}

function getTrainingDirs() {

    return fs.readdirSync(config.trainingDatasetDir, { encoding: 'utf8' });
}

function getImages(dir) {

    return fs.readdirSync(`${config.trainingDatasetDir}/${dir}`, { encoding: 'utf8' });
}

function getRGB(dir, image, callback) {

    PNG.decode(`${config.trainingDatasetDir}/${dir}/${image}`, (pixels) => {

        callback([pixels[0], pixels[1], pixels[2]]);
    });
}

module.exports = createTrainingData;
