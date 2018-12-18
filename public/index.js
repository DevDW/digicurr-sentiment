// Add functionality to navigation bar to bring sections into view when their respective button is clicked
document.getElementById('methodology-link').addEventListener('click', () => {
    document.getElementById('methodology-section').scrollIntoView();
})

document.getElementById('pb-link').addEventListener('click', () => {
    document.getElementById('project-background-section').scrollIntoView();
})

document.getElementById('about-link').addEventListener('click', () => {
    document.getElementById('about-section').scrollIntoView();
})

// Grab crypto icon HTML elements and assign them to variables for easier reference
const selectorBTC = document.getElementById('btc');
const selectorETH = document.getElementById('eth');
const selectorLTC = document.getElementById('ltc');

// Add functionality so when crypto icon is clicked, API calls are triggered and information is displayed
selectorBTC.addEventListener('click', displayBTC);
selectorETH.addEventListener('click', displayETH);
selectorLTC.addEventListener('click', displayLTC);

// Grab element containing button to clear queried information from display and element where queried information is displayed and assign them to variables for easier reference
const clearInfoDisplayArea = document.getElementById('clear-info');
const infoDisplayArea = document.getElementById('selected-crypto-info');

// Grab button in Methodology section and element containing truncated text in Methodology section and assign them to variables for easier reference. Then add click event listener on button
const readButton = document.getElementById('read-button');
const moreText = document.getElementById('read-more-text');
readButton.addEventListener('click', readMoreOrLess);

// ------------------------------------------------------

async function displayBTC() {
    const response = await fetch('/btc');
    const scoreAndMeaning = await response.json();
    const avgScore = scoreAndMeaning[0];
    const scoreMeaning = scoreAndMeaning[1];

    infoDisplayArea.innerHTML = '<p><u>Bitcoin</u></p>' + '<p>' + 'Average Sentiment Score: ' + avgScore + '</p>' + '<p>' + 'Sentiment: ' + scoreMeaning + '</p>'

    if (clearInfoDisplayArea.style.display === 'none') {
        showClearInfo();
    }
}

async function displayETH() {
    const response = await fetch('/eth');
    const scoreAndMeaning = await response.json();
    const avgScore = scoreAndMeaning[0];
    const scoreMeaning = scoreAndMeaning[1];

    infoDisplayArea.innerHTML = '<p><u>Ethereum</u></p>' + '<p>' + 'Average Sentiment Score: ' + avgScore + '</p>' + '<p>' + 'Sentiment: ' + scoreMeaning + '</p>'

    if (clearInfoDisplayArea.style.display === 'none') {
        showClearInfo();
    }
}

async function displayLTC() {
    const response = await fetch('/ltc');
    const scoreAndMeaning = await response.json();
    const avgScore = scoreAndMeaning[0];
    const scoreMeaning = scoreAndMeaning[1];

    infoDisplayArea.innerHTML = '<p><u>Litecoin</u></p>' + '<p>' + 'Average Sentiment Score: ' + avgScore + '</p>' + '<p>' + 'Sentiment: ' + scoreMeaning + '</p>'

    if (clearInfoDisplayArea.style.display === 'none') {
        showClearInfo();
    }
}

function showClearInfo() {
    clearInfoDisplayArea.style.display = 'block';
}

// If you click the button to clear the queried information from the screen, the button itself is removed, along with the queried information
clearInfoDisplayArea.addEventListener('click', function() {
    clearInfoDisplayArea.style.display = 'none';
    infoDisplayArea.innerHTML = '';
})

function readMoreOrLess() {
    if (moreText.style.display === 'none') {
        moreText.style.display = 'inline-block';
        readButton.innerHTML = 'Read Less';
    } else {
        moreText.style.display = 'none';
        readButton.innerHTML = 'Read More';
    }
}