'use strict';

let C = require('./constants');

global.os = {};

os.createSquad = function (name, type) {
    Memory.squads[name] = {
        'type': type,
        'isRetired': false,
        'isWaiting': true,
        'isActive': false
    };
};

os.generateName = function () {
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

os.generateCreepName = function () {
    let name = 'notaname';
    let nameComplete = false;
    do {
        name = os.generateName();
        nameComplete = !Empire.creeps.all[name];
    }
    while (!nameComplete);

    return name;
};
