import controls from '../../constants/controls';

function getRandomNumber() {
    return Math.random() + 1;
}

function getCriticalHitDamage(fighter) {
    return 2 * fighter.attack;
}

export function getBlockPower(fighter) {
    const dodgeChance = getRandomNumber();
    return fighter.defense * dodgeChance;
}

export function getHitPower(fighter) {
    const criticalHitChance = getRandomNumber();
    return fighter.attack * criticalHitChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
}

export async function fight(firstFighter, secondFighter) {
    let firstFighterHealth = firstFighter.health;
    let secondFighterHealth = secondFighter.health;
    const firstFighterHealthIndicator = document.getElementById('left-fighter-indicator');
    const secondFighterHealthIndicator = document.getElementById('right-fighter-indicator');
    const criticalHitCombinations = controls.PlayerOneCriticalHitCombination.concat(
        controls.PlayerTwoCriticalHitCombination
    );
    let firstFigtherCriticalHitTime = 0; // Date.now();
    let secondFigtherCriticalHitTime = 0; // Date.now();

    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        let firstFighterBlock = false;
        let secondFighterBlock = false;
        const criticalHits = new Set();
        const criticalHitInterval = 10 * 1000;

        const isHitAviable = () => !firstFighterBlock && !secondFighterBlock;
        const isCriticalHitAviable = (playerNumber, time) => {
            const criticalHitControls =
                playerNumber === 1
                    ? controls.PlayerOneCriticalHitCombination
                    : controls.PlayerTwoCriticalHitCombination;
            for (let i = 0; i < criticalHitControls.length; i += 1) {
                if (!criticalHits.has(criticalHitControls[i])) {
                    return false;
                }
            }
            const playerCriticalHitInterval =
                time - (playerNumber === 1 ? firstFigtherCriticalHitTime : secondFigtherCriticalHitTime);
            if (playerCriticalHitInterval < criticalHitInterval) {
                return false;
            }
            return true;
        };
        const getHealth = (currentHealth, fullHealth) => `${(currentHealth / fullHealth) * 100}%`;

        document.addEventListener('keyup', e => {
            if (e.code === controls.PlayerOneBlock) {
                firstFighterBlock = false;
            }
            if (e.code === controls.PlayerTwoBlock) {
                secondFighterBlock = false;
            }
            criticalHitCombinations.forEach(btn => {
                if (e.code === btn) {
                    criticalHits.delete(btn);
                }
            });
        });

        document.addEventListener('keydown', e => {
            if (isHitAviable() && e.code === controls.PlayerOneAttack) {
                secondFighterHealth -= getDamage(firstFighter, secondFighter);
                secondFighterHealthIndicator.style.width = getHealth(secondFighterHealth, secondFighter.health);
            }
            if (isHitAviable() && e.code === controls.PlayerTwoAttack) {
                firstFighterHealth -= getDamage(secondFighter, firstFighter);
                firstFighterHealthIndicator.style.width = getHealth(firstFighterHealth, firstFighter.health);
            }

            criticalHitCombinations.forEach(btn => {
                if (e.code === btn) {
                    criticalHits.add(btn);
                }
            });

            if (isCriticalHitAviable(1, Date.now())) {
                secondFighterHealth -= getCriticalHitDamage(firstFighter);
                secondFighterHealthIndicator.style.width = getHealth(secondFighterHealth, secondFighter?.health);
                firstFigtherCriticalHitTime = Date.now();
            }
            if (isCriticalHitAviable(2, Date.now())) {
                firstFighterHealth -= getCriticalHitDamage(secondFighter);
                firstFighterHealthIndicator.style.width = getHealth(firstFighterHealth, firstFighter?.health);
                secondFigtherCriticalHitTime = Date.now();
            }
            if (e.code === controls.PlayerOneBlock) {
                firstFighterBlock = true;
            }
            if (e.code === controls.PlayerTwoBlock) {
                secondFighterBlock = true;
            }
            if (firstFighterHealth <= 0) resolve(secondFighter);
            if (secondFighterHealth <= 0) resolve(firstFighter);
        });
    });
}
