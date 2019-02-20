'use strict';

let C = require('./constants');

global.brain = {
};

brain.generateName = function () {
    let isVowel = false;
    let charArray = C.VOWELS;
    let name = charArray[Math.round(Math.random() * (charArray.length - 1))].toUpperCase();

    let nameComplete = false;
    while (!nameComplete) {
        if (isVowel) {
            charArray = C.VOWELS;
        }
        else {
            charArray = C.CONSONANTS;
        }
        isVowel = !isVowel;
        name += charArray[Math.round(Math.random() * (charArray.length - 1))];
        nameComplete = !isVowel && name.length > C.CREEP_NAME_LENGTH;
    }

    return name;
};

brain.generateCreepName = function () {
    let name = 'notaname';
    let nameComplete = false;
    do {
        name = brain.generateName();
        nameComplete = !Empire.creeps.all[name];
    }
    while (!nameComplete);

    return name;
};
