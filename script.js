//background particles
const canvas = document.getElementById('season-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//this determines which season it is
const month = new Date().getMonth();
let season = 'winter';
if (month >= 2 && month <= 4) season = 'spring';
else if (month >= 5 && month <=7) season = 'summer';
else if (month >= 8 && month <=10) season = 'autumn';

const images = {
    winter: new Image(),
    spring: new Image(),
    summer: new Image(),
    autumn: new Image()
};

images.winter.src = 'assets/snowflake.png';
images.spring.src = 'assets/flower.png';
images.summer.src = 'assets/watermelon.png';
images.autumn.src = 'assets/leaf.png';

const particles = [];
const particleCount = 60;

//inilializes particles
for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: (i / particleCount) * canvas.height,
        size: 20 + Math.random() * 30,
        offset: Math.random() * 1000,
        angle: Math.random() * 360/180 * Math.PI,
        scale: 0.5 + Math.random() * 0.5,
        flipX: Math.random() > 0.5 ? -1 : 1,
        flipY: Math.random() > 0.5 ? -1 : 1
    });
}

//movement being applied
        const speed = { x: 0, y:1 };
        const summerBounce = 0.5;

  //Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);

        //randon mirroring and scale
        ctx.scale(p.flipX * p.scale, p.flipY * p.scale);
        
        //draw the image centered
        const img = images[season];
        const maxSize = 40;
        const scale = p.scale * (maxSize / Math.max(img.naturalWidth, img.naturalHeight));
        
        ctx.globalCompositeOperation = 'destination-over';
        ctx.globalAlpha = 0.7;
        ctx.drawImage(
            img,
            -img.naturalWidth / 2,
            -img.naturalHeight / 2,
            img.naturalWidth * scale,
            img.naturalHeight * scale
        );
        
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        //movement
        p.x += speed.x;
        p.y += speed.y;

        //summer bounce effect
        if (season === 'summer') {
            p.y += Math.sin((Date.now() + p.offset) / 300) * summerBounce;
        }

        //this wraps it around edges
        if (p.y > canvas.height) p.y = -p.size;
        if (p.y < -p.size) p.y = canvas.height;
        if (p.x > canvas.width) p.x = -p.size;
        if (p.x < -p.size) p.x = canvas.width;
    });

    requestAnimationFrame(animateParticles);
}

//this sizes the canvas onto the window
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const allImages = Object.values(images);
let loadedCount = 0;

allImages.forEach(img => {
    img.onload = () => {
        loadedCount++;
        if (loadedCount === allImages.length) {
            animateParticles();
        }
    }
});

//variable
let stitches = 0;
let coins = 0;
let stitchesPerClick = 1;
let stitchesPerSecond = 0;
let hookLevel = 0;
let helperLevel = 0;
let craftingSlots = 1;
let rareYarnActive = false;
let lastClickedElement = null;

const inventory = {
    Scarf: 0,
    Hat: 0,
    Blanket: 0
};

//This saves the game progress to a local storage
function savegame() {
    const gameState = {
        stitches,
        coins,
        stitchesPerClick,
        stitchesPerSecond,
        hookLevel,
        helperLevel,
        craftingSlots,
        rareYarnActive,
        inventory
    };
    sessionStorage.setItem('threadQuestSave', JSON.stringify(gameState));
}

//This loads the game progress from the local storage
function loadGame() {
    const saved = sessionStorage.getItem('threadQuestSave');
    if (saved) {
        const gameState = JSON.parse(saved);
        stitches = gameState.stitches || 0;
        coins = gameState.coins || 0;
        stitchesPerClick = gameState.stitchesPerClick || 1;
        stitchesPerSecond = gameState.stitchesPerSecond || 0;
        hookLevel = gameState.hookLevel || 0;
        helperLevel = gameState.craftingSlot || 0;
        rareYarnActive = gameState.rareYarnActive || false;
        Object.assign(inventory, gameState.inventory || {Scarf:0, Hat:0, Blanket:0});
    }
}

//ALL DOM elements
const stitchesDisplay = document.getElementById('stitches');
const coinsDisplay = document.getElementById('coins');
const hookBar = document.getElementById('hook-level');
const helperBar = document.getElementById('helper-level');
const yarn = document.getElementById('yarn');
const clickEffect = document.getElementById('click-effects');
const upgradeHookBtn = document.getElementById('upgrade-hook');
const hireHelperBtn = document.getElementById('hire-helper');
const buyYarnBtn = document.getElementById('buy-yarn');
const expandWorkshopBtn = document.getElementById('expand-workshop');
const craftingSlotsContainer = document.getElementById('crafting-slots');
const inventoryDisplay = document.getElementById('inventory');
const sellItemsBtn = document.getElementById('sell-items');
const achievementList = document.getElementById('achievement-list');
const popup = document.getElementById('popup');
const achievementSound = new Audio('assets/achievement.wav');
achievementSound.volume = 0.2;


//Helper functions
function updateDisplay() {
    animateCounter(stitchesDisplay, stitches);
    animateCounter(coinsDisplay, coins);
    hookBar.style.width = `${Math.min(hookLevel * 20, 100)}%`; 
    helperBar.style.width = `${Math.min(helperLevel * 20,100)}%`;
    inventoryDisplay.textContent = `Scarf: ${inventory.Scarf} | Hat: ${inventory.Hat} | Blanket: ${inventory.Blanket}`;
    animateGlow();
}

function showPopup(message, targetElement = null) {
    popup.textContent = message;
    
    const el = targetElement ||  lastClickedElement;
    
    if (el) {
        //So that the popup appears near the action
        const rect = el.getBoundingClientRect();
        popup.style.top = `${rect.top + window.scrollY - 10}px`;
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.transform = 'translateX(-50%)';
    } else {
        //Sets to default center of viewport
        popup.style.top = '20%';
        popup.style.left = '50%';
    }
    
    //animation
    popup.style.display = 'block';
    requestAnimationFrame(() => {
        popup.style.opacity = 1;
        popup.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        popup.style.opacity = 0;
        popup.style.transform = 'translateX(-50%) translateY(-20%)';
        setTimeout(() => {popup.style.display = 'none'; }, 400)
    }, 1500);
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
yarn.addEventListener('click', (e) => {
    lastClickedElement = e.target;
    let earned = stitchesPerClick;
    if (rareYarnActive) earned *=2;
    stitches += earned;

    animateClickEffect(5); //Create Multiple sparkles
    animateYarnClick();
    updateDisplay();
    unlockAchievement('First Stitch');
    savegame();
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
upgradeHookBtn.addEventListener('click', (e) => {
    lastClickedElement = e.target;
    if (coins >= 50) {
        coins -= 50;
        hookLevel += 1;
        stitchesPerClick += 1;
        updateDisplay();
        unlockAchievement('Hook Upgraded');
        savegame();
    } else showPopup('Sorry, not enough coins!', e);
});

hireHelperBtn.addEventListener('click', (e) => {
    if (coins >= 200) {
        coins -= 200;
        helperLevel += 1;
        stitchesPerSecond += 1;
        updateDisplay();
        unlockAchievement('Helper Hired');
        savegame();
    } else showPopup('Sorry, not enough coins!', e);
});

buyYarnBtn.addEventListener('click', (e) => {
    if (coins >= 300) {
        coins -= 300;
        rareYarnActive = true;
        showPopup('Rare Yarn Activated! x2 stitches for 30s!');
        updateDisplay();
        setTimeout(() => {
            rareYarnActive = false;
            showPopup("Rare Yarn Effect Wore Off!");
        }, 30000);
    } else showPopup('Sorry, not enough coins!', e);
});

expandWorkshopBtn.addEventListener('click', (e) => {
    if (coins >= 500) {
        coins -= 500; 
        craftingSlots += 1;
        createCraftingSlot();
        updateDisplay();
        showPopup("Workshop Expanded!");
        savegame();
    } else showPopup('Sorry, not enough coins!', e);
});

//ALL Crafting 
function createCraftingSlot() {
    craftingSlotsContainer.innerHTML = '';

    const costs = {
        Scarf: 20,
        Hat: 35,
        Blanket: 60
    };
    
    for (let i = 0; i < craftingSlots; i++) {
        const slot = document.createElement('div');
        slot.className = 'crafting-slot';
        slot.innerHTML = `
          <button onclick="craftItem('Scarf')">Scarf</button>
          <p class="craft-cost">Cost: ${costs.Scarf} stitches</p>
          
          <button onclick="craftItem('Hat')">Hat</button>
          <p class="craft-cost">Cost: ${costs.Hat} stitches</p>
          
          <button onclick="craftItem('Blanket')">Blanket</button>
          <p class="craft-cost">Cost: ${costs.Blanket} stitches</p>
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

    const cost = costs[item];

    //Check if enough stitches
    if (stitches >=cost) {
        stitches -= cost;
        inventory[item] += 1;
        showPopup(`Crafted a ${item}!`);
        updateDisplay();

        //unlock Achievements
        if (inventory.Scarf + inventory.Hat + inventory.Blanket === 1) {
            unlockAchievement('First Craft');
        }

        const totalItems = inventory.Scarf + inventory.Hat + inventory.Blanket;
        if (totalItems >=50) unlockAchievement('Master Crafter');
        savegame();
    } else {
        showPopup(`Sorry, not enough stitches to craft a ${item}!`);
    }
}


//Selling Items
sellItemsBtn.addEventListener('click', (e) => {
    lastClickedElement = e.target
    if (inventory.Scarf + inventory.Hat + inventory.Blanket > 0) {
        //calculate the coins based off of the item
        const earnedCoins = inventory.Scarf * 100000 + inventory.Hat * 25 + inventory.Blanket * 40;
        
        coins += earnedCoins;
        
        //reset the inventory
        inventory.Scarf = 0;
        inventory.Hat = 0;
        inventory.Blanket = 0;
        
        updateDisplay();
        showPopup(`Sold all items for ${earnedCoins} coins!`, e.target);
        savegame();
    } else {
        showPopup('No items to sell!', e.target);
    }
});

//The Passive Income from Helpers
setInterval(() => {
    stitches += stitchesPerSecond;
    updateDisplay();
}, 1000);

//the achievement unlock function
function unlockAchievement(name, targetElement = null) {
    const achievement = [...achievementList.children].find(
        a => a.dataset.name === name
    );

    if (achievement && !achievement.classList.contains('unlocked')) {
       //This marks it as unlocked
       achievement.classList.add('unlocked');
       achievement.style.transform = 'scale(1.1)';
       achievement.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
       achievement.style.boxShadow = '0 0 15px rgba(180,150,255,0.8)';

       //resetting the animation
       setTimeout(() => {
         achievement.style.transform = 'scale(1)';
         achievement.style.boxShadow = '';
       }, 400);

       //popup message
       showPopup(`Achievement Unlocked: ${name}!`, targetElement);
       
       //Sound
       achievementSound.currentTime = 0;
       achievementSound.play();
   
    }
}


//Initialize
window.craftItem = craftItem; //Make craftItem globally accessible

loadGame();
updateDisplay();

//glow pulse for yarn
const yarnElement = document.getElementById('yarn');
yarnElement.classList.add('yarn-glow-animation');

//reset button
document.addEventListener('DOMContentLoaded', () => {
const resetBtn = document.getElementById('reset-game');

resetBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset the game?")) {
        //this will clear the local history
        sessionStorage.removeItem('threadQuestSave');

        //reset all the variables
        stitches = 0;
        coins = 0;
        stitchesPerClick = 1;
        stitchesPerSecond = 0;
        hookLevel = 0;
        helperLevel = 0;
        craftingSlots = 1;
        rareYarnActive = false;
        Object.keys(inventory).forEach(key => inventory[key] = 0);

        //reset achievements visually
        document.querySelectorAll('#achievement-list .achievement').forEach(a => {
            a.classList.remove('unlocked');
            a.style.boxShadow = '';
            a.style.transform = '';
        });

        //refresh the crafting slots
        createCraftingSlot();

        //update the display
        updateDisplay();

        //popup
        showPopup("Game Fully Reset!");
    }
});
});