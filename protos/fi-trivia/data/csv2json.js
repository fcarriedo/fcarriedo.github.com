// Transforms a CSV file to the JSON format required by the game questions.

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('quiz-questions.csv')
});


const questionPool = {};

let i = 0;
lineReader.on('line', line => {
  // Split it by ',' since it is a CSV file
  const parts = line.split(',');

  const question = parts[0];

  // Bypass the first line (headers)
  if (question === 'question') {
    return;
  }

  const qId = `q${++i}`;

  const correctAns = parts[2];

  const incorrectAns1 = parts[3];
  const incorrectAns2 = parts[4];
  const incorrectAns3 = parts[5];

  const difficulty = parseFloat(parts[6]);

  // Let's create the question object
  const q = {
    id: qId,
    difficulty: difficulty,
    question: question,
    answers: [
      {id: 'a1', text: correctAns, correct: true},
      {id: 'a2', text: incorrectAns1},
      {id: 'a3', text: incorrectAns2},
      {id: 'a4', text: incorrectAns3}
    ]
  };

  questionPool[qId] = q;
});

// When finished reading the stream let's print to output.
lineReader.on('close', _ => console.log(JSON.stringify(questionPool)));
