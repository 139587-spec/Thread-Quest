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
const coinsDisplay = document.getElementById('coins');
const hookBar = document.getElementById('hook-level');
const helperBar = document.getElementById('helper-level');
const yarn = document.getElementById('yarn');
const clickEffect = document.getElementById('click-effect');
const upgradeHookBtn = document.getElementById('upgrade-hook');
const hireHelperBtn = document.getElementById('hire-helper');
const buyYarnBtn = document.getElementById('buy-yarn');
const expandWorkshopBtn = document.getElementById('expand-workshop');
const craftingSlotsContainer = document.getElementById('crafting-slots');
const inventoryDisplay = document.getElementById('inventory');
const sellItemsBtn = document.getElementById('sell-items');
const achievementList = document.getElementById('achievement-list');
const popup = document.getElementById('popup');

//Helper functions
function updateDisplay() {
    animateCounter(stitchesDisplay, stitches);
    animateCounter(coinsDisplay, coins);
    hookBar.style.width = `${Math.min(hookLevel * 20, 100)}%`; 
    helperBar.style.width = `${Math.min(helperLevel * 20,100)}%`;
    inventoryDisplay.textContent = `Scarf: ${inventory.Scarf} | Hat: ${inventory.Hat} | Blanket: ${inventory.Blanket}`;
}

function showPopup(message) {
    popup.textContent = message;
    popup.style.opacity = 1;
    popup.style.transform = 'translate(-50%, -30px)';
    setTimerout(() => {
        popup.style.opacity = 0;
        popup.style.transform = 'translate(-50%, -30px)';
    }, 1500);
}

function unlockAchievement(name) {
    const achievement = [...achievementList.children].find(a => a.dataset.name === name);
    if (achievement && !achievement.classList.contains('unlocked')) {
        achievement.classList.add('unlocked');
        achievement.style.transform = 'scale(1)', 500;
        setTimeout(() => achievement.style.transform = 'scale(1)', 500);
        showPopup(`Achievement Unlocked: ${name}`);
    }
}

//Counter Animation
function animateCounter(element, target) {
    const current = parseInt(element.textContent);
    const step = Math.ceil((target - current) / 10);
    if (current < target) {
        element.textContent = current + step;
        requestAnimationFrame(() => animateCounter(element, target));
    } else {
        element.textContent = target;
    }
}

//How the Clicker Works
yarn.addEventListener('click', () => {
    let earned = stitchesPerClick;
})

