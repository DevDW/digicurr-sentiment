// Setup variables, API keys config, etc.
const Twit = require('twit');
const Express = require('express');
const App = Express();
const path = require('path');
const Sentiment = require('sentiment');
const customOptions = require('./sentiment_custom_options');
const port = process.env.PORT || 5000;

require('dotenv').config();

const config_twitter = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000
};

const api = new Twit(config_twitter);

App.listen(port, () => console.log(`Listening on port ${port}`));

App.use(Express.static('public'));

// Retrieve tweets for BTC, ETH, LTC
let today = new Date();
let yesterday = `${today.getFullYear()}-${today.getMonth()}-${today.getDate() - 1}`

App.get('/:crypto', (req, res) => {
    const apiCall = function(query) {
        api.get('search/tweets', { q: query + ' since:' + yesterday + ' -filter:retweets', lang: 'en', result_type: 'popular', tweet_mode: 'extended' }, function(err, data, response) {
            try {
                getTweetText(data);
                preprocessedTweets.forEach(analyzeSentiment);
                let avgScore = sentimentScoreAveraging(sentimentScores);
                let avgScoreMeaning = scoreMeaning(avgSentimentScore);
                res.json([avgScore, avgScoreMeaning]);
                clearTweets();
                clearPreviousScores();
            } catch(err) {
                res.json(['Technical error: Please try again later', 'Technical Error: Please try again later']);
            }
        })
    }

    switch(req.params.crypto) {
        case 'btc':
            apiCall('bitcoin OR btc');
            break;
        case 'eth':
            apiCall('ethereum OR eth');
            break;
        case 'ltc':
            apiCall('litecoin OR ltc');
            break;
    }
})

// Store full text of each retrieved tweet
let preprocessedTweets = [];

function getTweetText(data) {
    let statuses = data['statuses'];

    for (let i = 0; i < statuses.length; i++) {
        let tweetText = statuses[i]['full_text'];
        preprocessedTweets.push(tweetText);
    }
}

// Analyze tweet sentiment
function analyzeSentiment(preprocessedTweet) {
    let sentiment = new Sentiment();
    let sentimentAnalysis = sentiment.analyze(preprocessedTweet, customOptions);
    sentimentScores.push(sentimentAnalysis['score']);
}

// Store sentiment score for each tweet
let sentimentScores = [];

// Average out the sentiment scores across the tweets
let avgSentimentScore = null;

function sentimentScoreAveraging(sentimentScores) {
    let sumOfSentimentScores = sentimentScores.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    avgSentimentScore = (sumOfSentimentScores / preprocessedTweets.length).toFixed(2);

    return avgSentimentScore;
}

function scoreMeaning(avgSentimentScore) {
    if (avgSentimentScore < -3) {
        return "Highly Negative"
    } else if (avgSentimentScore >= -3 && avgSentimentScore < -1) {
        return "Slightly Negative"
    } else if (avgSentimentScore >= -1 && avgSentimentScore < 1) {
        return "Neutral"
    } else if (avgSentimentScore >= 1 && avgSentimentScore <= 3) {
        return "Slightly Positive"
    } else if (avgSentimentScore > 3) {
        return "Highly Positive"
    }
}

// Clear the stored tweets and sentiment scores to allow for new data to be cleanly processed when requested
function clearTweets() {
    return preprocessedTweets = [];
}

function clearPreviousScores() {
    avgSentimentScore = null;
    return sentimentScores = [];
}
