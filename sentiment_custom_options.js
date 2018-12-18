// These custom options include and score key words and phrases associated with the cryptocurrency market (e.g., "bear market," "bull market," "selloff," and "recovery") that are not included in the AFINN-165 word list used by the Sentiment module. Additionally, the default scoring strategy for negation is improved by adding more words that negate.

module.exports.options = {
    extras: {
        'bear': -4,
        'bears': -4,
        'bear market': -4,
        'down': -3,
        'decline': -3,
        'declines': -3,
        'declining': -3,
        'falls': -3,
        'sell': -3,
        'selling': -3,
        'selloff': -4,
        'bull': 4,
        'bulls': 4,
        'bull market': 5,
        'boom': 3,
        'buy': 3,
        'bought': 3,
        'comeback': 3,
        'recover': 3,
        'recovery': 3,
        'recovering': 3
    },
    scoringStrategy: {
        apply: function(tokens, cursor, tokenScore) {
            if (cursor > 0) {
                let prevtoken = tokens[cursor - 1];
                if (prevtoken === 'not' || prevtoken === 'aren\'t' || prevtoken === 'isn\'t' || prevtoken === 'don\'t' ) {
                    tokenScore = -tokenScore
                }
            }
            return tokenScore;
        }
    }
}