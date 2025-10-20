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
    animateGlow();
}

function showPopup(message) {
    popup.textContent = message;
    popup.style.opacity = 1;
    popup.style.transform = 'translate(-50%, -10px)';
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.opacity = 0;
        popup.style.transform = 'translate(-50%, -30px)';
    }, 1500);
}

function unlockAchievement(name) {
    const achievement = [...achievementList.children].find(a => a.dataset.name === name);
    if (achievement && !achievement.classList.contains('unlocked')) {
        achievement.classList.add('unlocked');
        achievement.style.transform = 'scale(1.1)';
        setTimeout(() => achievement.style.transform = 'scale(1)', 500);
        showPopup(`Achievement Unlocked: ${name}`);
    }
}

//Counter Animation
function animateCounter(element, target) {
    const current = parseInt(element.textContent) || 0;
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
        sparkle.style.fontSize = `${Math.random() * 12}px`;
        sparkle.style.opacity = 1;
        sparkle.style.transition = 'all 0.8s ease-out';
        clickEffect.appendChild(sparkle);

        setTimeout(() => {
            sparkle.style.top = `${parseFloat(sparkle.style.top) - 30}px`;
            sparkle.style.opacity = 0;
        }, 50);

        setTimeout(() => clickEffect.removeChild(sparkle), 850);
    }
}

//The Yarn Bounce Effects
function animateYarnClick() {
    yarn.style.transform = 'scale(1.15) rotate(-5deg)';
    setTimeout(() => {
        yarn.style.transform = 'scale(1) rotate(0deg)';
    }, 150);
}

//Color Shift - Really Subtle
function animateGlow() {
    //Yarn Pulsing
    const time = Date.now() / 1000;
    const hue = 260 + 10 * Math.sin(time* 2); //Pastel purple to blue shift
    yarn.style.boxShadow = `0 0 20px hsla(${hue}, 70%, 80%, 0.7)`;

    //Glow for Shop items
    document.querySelectorAll('.shop-item').forEach(item => {
        const hueShift = 220 + 10 * Math.sin(time);
        item.style.boxShadow = `0 4px 12px hsla(${hueShift}, 70%, 80%, 0.7)`;
    });
}
setInterval(animateGlow, 50); //The glow continues

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
    if (coins >= 300) {
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

expandWorkshopBtn.addEventListener('click', () => {
    if (coins >= 500) {
        coins -= 500; 
        craftingSlots += 1;
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
        slot.innerHTML = `
          <button onclick="craftItem('Scarf')">Scarf</button>
          <button onclick="craftItem('Hat')">Hat</button>
          <button onclick="craftItem('Blanket')">Blanket</button>
        `;
        craftingSlotsContainer.appendChild(slot);
    }
}
createCraftingSlot();

function craftItem(item) {
    const costs = {
        Scarf: 20,
        Hat: 35,
        Blanket: 60
    };

    const cost = costs[items];

    //Check if enough stitches
    if (stitches >=cost) {
        stitches -= cost;
        inventory[item] += 1;
        showPopup(`Crafted a ${item}! (-${cost} stitches)`);
        updateDisplay();

        //unlock Achievements
        if (inventory.Scarf + inventory.Hat + inventory.Blanket === 1) {
            unlockAchievement('First Craft');
        }

        const totalItems = inventory.Scarf + inventory.Hat + inventory.Blanket;
        if (totalItems >=50) unlockAchievement('Master Crafter');
    } else {
        showPopup(`Sorry, not enough stitches to craft a ${item}!`);
    }
}

//Selling Items
sellItemsBtn.addEventListener('click', () => {
    const totalItems = inventory.Scarf + inventory.Hat + inventory.Blanket;
    if (totalItems > 0) {
        coins += totalItems * 10;
        inventory.Scarf = 0;
        inventory.Hat = 0;
        inventory.Blanket = 0;
        updateDisplay();
        showPopup(`Sold ${totalItems} items for ${totalItems * 10} coins!`);
    } else showPopup('No items to sell!');
});

//The Passive Income from Helpers
setInterval(() => {
    stitches += stitchesPerSecond;
    updateDisplay();
}, 1000);

//Initialize
updateDisplay();





