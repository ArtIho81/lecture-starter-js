// import controls from '../../constants/controls';

function getRandomNumber() {
    return Math.random() + 1;
}

// function getCriticalHitDamage(fighter) {
//     return 2 * fighter.attack;
// }

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

// export async function fight(firstFighter, secondFighter) {
// return new Promise(resolve => {
//     // resolve the promise with the winner when fight is over
// });
// }
