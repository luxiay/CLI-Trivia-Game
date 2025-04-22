import fs from 'fs';
import path from 'path';

export function getRandomQuestions(count = 1, usedQuestions = []) {
  const filePath = path.resolve('data', 'questions.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const allQuestions = JSON.parse(rawData);

  const unusedQuestions = allQuestions.filter(
    (q) => !usedQuestions.includes(q.question)
  );

  // Fisher-Yates shuffle
  for (let i = unusedQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    //[allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    [unusedQuestions[i], unusedQuestions[j]] = [unusedQuestions[j], unusedQuestions[i]];
  }

  //return allQuestions.slice(0, count);
  return unusedQuestions.slice(0, count);
}


// const questions = getRandomQuestions(1);  
// console.log('Randomly selected questions:\n', questions);