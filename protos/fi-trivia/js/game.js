const config = {
  // Let's version the configuration.
  version: 'v2017-03-17',
  // The minimum questions to get right to consider it a win.
  minToWin: 4,
  // seconds / question
  timeout: 10,
  // The template specifies the order of the questions as well as the
  // difficulty ranges for each.
  tmpl: {
    "1": {difficulty: {min: 0.1, max: 0.2}},
    "2": {difficulty: {min: 0.2, max: 0.3}},
    "3": {difficulty: {min: 0.4, max: 0.5}},
    "4": {difficulty: {min: 0.5, max: 0.6}},
    "5": {difficulty: {min: 0.6, max: 0.7}},
    "6": {difficulty: {min: 0.7, max: 0.8}},
  }
};


(function(cfg, qPool) {
  'use strict';

  const cfgErr = validateConfig(cfg);
  if (cfgErr) {
    fatal(cfgErr);
    return;
  }


  // The total questions are defined by the template.
  const totalQuestions = Object.keys(cfg.tmpl).length;
  // The maximum amount of missed possible.
  const maxMisses = totalQuestions - cfg.minToWin;

  const game = {};

  game.totalQuestions = totalQuestions;
  game.minToWin = cfg.minToWin;
  game.maxMisses = maxMisses;

  const tmplBuckets = generateBuckets(cfg.tmpl, qPool);
  //console.log(JSON.stringify(tmplBuckets, null, 2));

  game.createNew = function() {
    return newGame(cfg.tmpl, tmplBuckets);
  }

  /**
   * Generates a new game based on the given template.
   */
  function newGame(tmpl, tmplBuckets) {

    /**
     * Appends a random question from the given bucket to the question array.
     */
    function appendRand(qArr, bucket) {
      // Try a maximum of 3 times to get a different answer if already exists
      // in the selection.
      for (let i = 0; i < 3; i++) {
        // Get random int (index) from the total number of questions in bucket.
        const randIx = getRandomInt(bucket.length); 
        // Select random question from the bucket and get its ID
        const randQuestionId = bucket[randIx].id;
        // Add question to array if doesn't exist or we're at the last try.
        if (qArr.indexOf(randQuestionId) == -1 || i === 2) {
          // Add it to the array if doesn't exist
          qArr.push(randQuestionId);
          // break the 'for'. No need to continue.
          break;
        }
      }

      return qArr;
    }

    // Create a new game
    function createNew() {
      const questions = Object.keys(tmpl)
        // Select a random set of questions (returns set of qId)
        .reduce((qArr, k) => appendRand(qArr, tmplBuckets[k]), [])
        // Maps the question IDs to actual questions (cloned)
        .map(qId => naiveClone(qPool[qId]))
        // Shuffle the question's answers
        .map(q => {q.answers = shuffle(q.answers); return q});

      return {
        created: new Date().toISOString(),
        questions: questions
      };
    }

    return createNew();
  }

  /**
   * Updates the game.
   */
  game.update = function(g) {

    const totalAnswered = g.questions.reduce((acc, q) => {
      if (q.answers.filter(a => a.selected === true).length > 0) {
        acc += 1;
      }
      return acc;
    }, 0);

    const totalCorrect = g.questions.reduce((acc, q) => {
      // If a question has been answered.
      if (q.answers.filter(a => a.selected === true && a.correct === true).length > 0) {
        acc += 1;
      }
      return acc;
    }, 0);

    const totalTimedout = g.questions.filter(q => q.timedout === true).length;

    const totalPresented = totalAnswered + totalTimedout;
    const totalMissed = totalPresented - totalCorrect;
    // Answered but incorrect
    const totalIncorrect = totalAnswered - totalCorrect;

    // Save up the stats
    g.stats = {
      totalPresented: totalPresented,
      totalMissed:    totalMissed,
      totalAnswered:  totalAnswered,
      totalTimedout:  totalTimedout,
      totalCorrect:   totalCorrect,
    };

    if (totalCorrect >= cfg.minToWin) {
      // Game won!
      console.log('game won!')
      g.result = 'won';
    } else if (totalMissed > maxMisses) {
      // Game over
      console.error('game over :(')
      g.result = 'lost';
    }

    return g;
  }


  //let newg = newGame(cfg.tmpl, tmplBuckets);
  //newg.questions[0].answers[0].selected = true;
  //newg.questions[1].answers[0].selected = true;
  //newg.questions[2].timedout = true;
  //console.log(JSON.stringify(newg, null, 2));

  //newg = game.update(newg);
  //console.log(JSON.stringify(newg, null, 2));

  /*
   * Generates the buckets of questions based on the template spec.
   * 
   * The key to each bucket is the same key of the template for each question.
   */
  function generateBuckets(tmpl, questionsPool) {

    // Position the question on the appropriate buckets.
    function position(q, buckets) {
      Object.keys(tmpl).forEach((id) => {
        const tmplQ = tmpl[id];
        if (q.difficulty > tmplQ.difficulty.min && q.difficulty <= tmplQ.difficulty.max) {
          buckets[id] = buckets[id] || [];
          buckets[id].push(q);
        }
      });

      return buckets;
    }

    return Object.keys(questionsPool)
      .reduce((buckets, key) => position(questionsPool[key], buckets), {});
  }

  // Selects a random integer from the [0, max) range.
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  // Shuffles an array.
  function shuffle(arr) {
    return arr.sort((a, b) => 0.5 - Math.random());
  }

  function wait(ms) {
    return new Promise(r => setTimeout(r, ms))
  }

  // Clones the JSON object... naively.
  function naiveClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  /**
   * Validates that the basic configuration is present
   */
  function validateConfig(c) {
    if (!c.tmpl) {
      return 'A template with question parameters is required';
    }

    const tmplLen = Object.keys(c.tmpl).length;

    // Verify that the template exists and has questions
    if (tmplLen === 0) {
      return 'A template with question parameters is required';
    }

    // Verify that the template exists and has questions
    if (!c.minToWin || c.minToWin <= 0) {
      return 'Minimum number of questions to win needs to be > 0';
    }

    if (c.minToWin > tmplLen) {
      return 'minToWin has to be less or equal to the number of questions in the template';
    }
  }

  /**
   * 'fatal' logs as console.error() and throws an awful alert.
   */
  function fatal(err) {
    console.error(err);
    //alert(err);
  }



  // Let's link them as a module or to the window
  if (typeof module != 'undefined' && module.exports) {
    // Module exports
    module.exports = game;
  } else {
    // Browser
    self.game = game;
  }

})(config, questionPool);
