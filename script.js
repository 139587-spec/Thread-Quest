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
    if (rareYarnActive) earned *=2;
    stitches += earned;

    animateClickEffect(5); //Create Multiple sparkles
    animateYarnClick();
    updateDisplay();
    unlockAchievement('First Stitch');
});

//The Multiple Sparkles
function animateClickEffect(count) {
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.top = `${(Math.random() - 0.5) * 50}px`;
        sparkle.style.left = `${(Math.random() - 0.5) * 50}px`;
        sparkle.style.fontsize = `${Math.random() * 20}px`;
        sparkle.style.opacity = 1;
        sparkle.style.transition = 'all 0.8s ease-out';
        clickEffects.appendChild(sparkle);

        setTimeout(() => {
            sparkle.style.top = `${parseFloat(sparkle.style.top) - 30}px`;
            sparkle.style.opacity = 0;
        }, 50);

        setTimeout(() => clickEffects.removeChild(sparkle), 850);
    }
}

//The Yarn Bounce Effects
function animateYarnClick() {
    yarn.style.transform = 'scale(1.15) rotate(-5deg)';
    setTimeout(() => {
        yarn.style.transform = 'scale(1) rotate(0deg)';
    }, 150);
}

//Buttons for Shop
upgradeHookBtn.addEventListener('click', () => {
    if (coins >= 50) {
        coins -= 50;
        hookLevel += 1;
        stitchesPerClick += 1;
        updateDisplay();
        unlockAchievement('Hook Upgraded!');
    } else showPopup('Sorry, not enough coins!');
});

hireHelperBtn.addEventListener('click', () => {
    if (coins >= 200) {
        coins -= 200;
        helperLevel += 1;
        stitchesPerSecond += 1;
        updateDisplay();
        unlockedAchievement('Helper Hired!');
    } else showPopup('Sorry, not enough coins!');
});

buyYarnBtn.addEventListener('click', () => {
    if (coins >= 300 {
        coins -= 300;
        rareYarnActive = true;
        showPopup('Rare Yarn Activated! x2 stitches for 30s!');
        updateDisplay();
        setTimeout(() => {
            rareYarnActive = false;
            showPopup("Rare Yarn Effect Wore Off!");
        }, 30000);
    } else showPopup('Sorry, not enough coins!');
});

expandWorkshopBtn.addEventListener('clicker', () => {
    if (coins >= 500) {
        coins -= 500; craftingSlots += 1;
        createCraftingSlot();
        updateDisplay();
        showPopup("Workshop Expanded!");
    } else showPopup('Sorry, not enough coins!');
});

//ALL Crafting 
function createCraftingSlot() {
    craftingSlotsContainer.innerHTML = '';
    for (let i = 0; i < craftingSlots; i++) {
        const slot = document.createElement('div');
        slot.className = 'crafting-slot';
        slot.innerHTML =
          <button onclick="craftItem('Scarf')">Scarf</button>
          <button onclick="craftItem('Hat')">Hat</button>
            <button onclick="craftItem('Blanket')">Blanket</button>
    ;
    craftingSlotsContainer.appendChild(slot);
    }
}

