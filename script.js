//variable
let stitches = 0;
let coins = 0;
let stitchesPerClick = 1;
let stitchesPerSecond = 0;
let hookLevel = 0;
let helperLevel = 0;
let craftingSlots = 1;
let rareYarnActive = false;

const inventory = {
    Scarf: 0,
    Hat: 0,
    Blanket: 0
};

//ALL DOM elements
const stitchesDisplay = document.getElementById('stitches');
const coinsDisplay = document.getElementById('coins')
