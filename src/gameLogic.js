
import chalk from "chalk";
import { select } from "@inquirer/prompts";
import { getRandomQuestions } from "./questionService.js";

// Keep track of score, question count, used questions, and user answers
let score = 0;
let questionCount = 0;
const usedQuestions = [];
const answeredQuestions = [];

// Display the main menu
export async function showMainMenu() {
    const action = await select({
      message: "Main Menu",
      choices: [
        { name: "Start Game", value: "start" },
        { name: "See Scores", value: "score" },
        { name: "Quit", value: "quit" },
      ],
    });
  
    switch (action) {
      case "start":
        resetGame(); // Reset game state
        await startGame();
        break;
      case "score":
        showScore(); // Display current score
        await showMainMenu();
        break;
      case "quit":
        console.log("Goodbye!");
        process.exit(0);
    }
}


// Start the trivia game loop
// use while loop
export async function startGame() {
  console.log(chalk.cyanBright("\n Welcome to the Trivia Game! You'll answer 6 questions with 5 seconds each. Good luck!\n"));
  
  // Keep asking questions until 6 unique questions have been used
  while (usedQuestions.length < 6) {
    // Get one random question that hasn't been used yet
    ////const [question] = getRandomQuestions(1, usedQuestions);
    const newQuestions = getRandomQuestions(1, usedQuestions);
    const [question] = newQuestions;

    if (!question) {
      console.log("No more questions left!");
      break;
    }

    // Mark this question as used
    usedQuestions.push(question.question);

    // Destructure question details
    const { question: qText, choices, answer } = question;
    console.log(`\nQuestion: ${qText}`);

    // timer for answer with a timeout (default 5 seconds)
    const userChoice = await answerTimeout({
      message: "Choose your answer",
      choices: choices.map((choice) => ({ name: choice, value: choice })),
      timeout: 5000
    });

    // Evaluate user's response
    if (userChoice === null) {
      console.log(chalk.red("\n Time's up! You didn't answer in time."));
    } else if (userChoice === answer) {
      console.log(chalk.green("Correct!"));
      score++;
    } else {
      console.log(chalk.red(`Wrong! The correct answer is ${answer}`));
    }

    // Store the question result in summary
    answeredQuestions.push({
      question: question.question,
      userAnswer: userChoice ?? 'No Answer',
      correctAnswer: question.answer,
      isCorrect: userChoice === question.answer
    });
  }

  // Game finished
  console.log(chalk.yellow("\nYou're done!"));
  showScore();
  showSummary(answeredQuestions);
  await showMainMenu();
}


// Show the current score
function showScore() {
  console.log(chalk.yellow(`\nYour score is: ${score}\n`));
}

// Display summary of user answers
function showSummary(answeredQuestions) {
  console.log("\nHere's a summary of your answers:\n");

  answeredQuestions.forEach((q, index) => {
    console.log(`Q${index + 1}: ${q.question}`);
    console.log(`   Correct answer: ${q.correctAnswer}`);

    if (q.userAnswer === null || q.userAnswer === 'No Answer') {
      console.log(chalk.red("   Result: Didn't answer"));
    } else if (q.isCorrect) {
      console.log(chalk.green("   Result: Correct"));
    } else {
      console.log(chalk.red("   Result: Incorrect"));
      console.log(`   Your answer: ${q.userAnswer}`);
    }
  });
}

// Reset all game state
function resetGame() {
  score = 0;
  questionCount = 0;
  usedQuestions.length = 0;
  answeredQuestions.length = 0;
}

// Select with timeout limit
export async function answerTimeout({ message, choices, timeout = 5000 }) {
  try {
    const userChoice = await Promise.race([
      select({
        message,
        choices,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeout)
      ),
    ]);
    return userChoice;
  } catch (err) {
    if (err.message === "timeout") {
      return null;  // Timeout - user did not answer
    } else {
      throw err; // Rethrow other errors
    }
  }
}




// use recursive loop
// export async function startGame() {
//   const [question] = getRandomQuestions(1, usedQuestions);
//   if (!question) {
//     console.log("No more questions left!");
//     return showScore(score);
//   }

//   usedQuestions.push(question.question); /// Mark question as used
//   const { question: qText, choices, answer } = question;

//   console.log(`\nQuestion: ${qText}`);

//   const userChoice = await answerTimeout({
//     message: "Choose your answer",
//     choices: choices.map((choice) => ({ name: choice, value: choice })),
//     timeout: 5000 //5 seconds to answer the question
//   });

//   //display user choice
//   if (userChoice === null) {
//     console.log(chalk.red("\n Time's up! You didn't answer in time."));
//   } else if (userChoice === answer) {
//     console.log(chalk.green("Correct!"));
//     score++;
//   } else {
//     console.log(chalk.red(`Wrong! The correct answer is ${answer}`));
//   }

//   answeredQuestions.push({
//     question: question.question,
//     userAnswer: userChoice ?? 'No Answer',
//     correctAnswer: question.answer,
//     isCorrect: userChoice === question.answer
//   });

//   if (usedQuestions.length >= 6) {
//     console.log(chalk.yellow("\nYou're done!"));
//     showScore();
//     showSummary(answeredQuestions);
//     console.log("\nDo you want to play again?");
//     await showMainMenu(); 
//     return; //end recursive loop
//   }

//   await startGame(); //Continue to next question（recursive call)
// }













///////////////////////////////////////////////////////////////////////////////////////
//pseudocode//

// import chalk from "chalk";
// import { select } from "@inquirer/prompts";


// export async function showMainMenu() {
//   const action = await select({
//     message: "Main Menu",
//     choices: [
//       { name: "Start Game", value: "start" },
//       { name: "See Scores", value: "score"},
//       { name: "Reset score", value: "reset" },
//       { name: "Quit", value: "quit" },
//     ],
//   });

//   switch (action) {
//     case "start":
//       await startGame();
//       break;
//     case "score":
//       showScore(score);
//       break;
//     case "reset":
//       resetGame();
//       console.log(chalk.blue("Score has been reset."));
//       showMainMenu();
//       break;
//     case "quit":
//       console.log("Goodbye!");
//       process.exit(0);
//   }
// }


// export async function startGame() {
//     let score = 0;
//     const questions = getRandomQuestions(1)
//     console.log('Questin: ${question}')
//     const userChoice = await select({
//       message: "Choose your answer",
//       choices: choices.map((choice) => ({ name: choice, value: choice })),
//     });
  
//     console.log(chalk.blue(`You chose: ${choice}`));
//     showMainMenu();
// }
  
// export function determineAnswer(userChoice, question, score) {
//     const correctAns = question[answer]

//     if (userChoice === correctAns) {
//         console.log("Correct!")
//         score++
//     } else {
//         console.log("Wrong Answer!")
//     }
// }

// function showScore(score) {
//     console.log(chalk.blue(`Your scores: ${score}`));
// }

// function resetGame() {
//     score = 0;
// }

// function counter() {
//     if () {
//         count++
//     }
//     if (count===6){
//         console.log("You'r done!")
//         showScore(sorce)
//     }

// }

// export { determineWinner }; 