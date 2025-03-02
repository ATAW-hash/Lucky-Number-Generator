function generateNumbers() {
    const birthdate = document.getElementById('birthdate').value;
    const playdate = document.getElementById('playdate').value;
    const lotteryType = document.getElementById('lotteryType').value;
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = "<div class='set'>Your lucky numbers are generating...</div>";

    if (!birthdate || !playdate) {
        resultsDiv.innerHTML = "<div class='set'>Please enter both birthdate and playdate.</div>";
        return;
    }

    const birthDateNum = calculateDateNumber(birthdate);
    const playDateNum = calculateDateNumber(playdate);
    const zodiacName = getZodiacSign(birthdate);

    setTimeout(() => {
        resultsDiv.innerHTML = "<div class='set'>Your lucky numbers are:</div>";

        if (["4D", "5D", "6D"].includes(lotteryType)) {
            const numDigits = parseInt(lotteryType[0]);
            const allSets = generateUniqueNumbers(numDigits, birthDateNum + playDateNum);

            resultsDiv.innerHTML += `<div class="set">Zodiac Lucky Number (${zodiacName}): ${generateUniqueNumbers(numDigits, birthDateNum)[0]}</div>`;
            
            allSets.forEach((set, i) => {
                resultsDiv.innerHTML += `<div class="set">Lucky ${i + 1}: ${set}</div>`;
            });

        } else {
            resultsDiv.innerHTML += `<div class="set">Zodiac Lucky Number (${zodiacName}): ${generateTotoNumbers(lotteryType, birthDateNum).join(' ')}</div>`;

            for (let i = 0; i < 3; i++) {
                resultsDiv.innerHTML += `<div class="set">Lucky ${i + 1}: ${generateTotoNumbers(lotteryType, birthDateNum + playDateNum + i).join(' ')}</div>`;
            }
        }

        resultsDiv.innerHTML += "<div class='set'>Good Luck!</div>";
    }, 2000);
}

function calculateDateNumber(dateString) {
    return dateString.split('-').reduce((sum, num) => sum + Number(num), 0);
}

function getZodiacSign(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfYear = Math.floor((date - new Date(year, 0, 0)) / 86400000);

    return ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"][Math.floor(dayOfYear / 30.5)];
}

function generateUniqueNumbers(numDigits, seed) {
    let sets = new Set();
    const random = mulberry32(seed);

    while (sets.size < 3) {
        let num = '';
        while (num.length < numDigits) {
            num += Math.floor(random() * 10);
        }
        sets.add(num);
    }

    return [...sets];
}

function generateTotoNumbers(lotteryType, seed) {
    const maxNumber = {"Supreme Toto": 58, "Power Toto": 55, "Star Toto": 50}[lotteryType] || 50;
    const numbers = new Set();
    const random = mulberry32(seed);

    while (numbers.size < 6) {
        numbers.add(Math.floor(random() * maxNumber) + 1);
    }

    return [...numbers].sort((a, b) => a - b);
}

function mulberry32(seed) {
    return function() {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ seed >>> 15, seed | 1);
        t ^= t + Math.imul(t ^ t >>> 7, seed | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
