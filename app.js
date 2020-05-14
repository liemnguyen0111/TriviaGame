const fs = require('fs')
const chalk = require('chalk')
const {prompt} = require('inquirer')
const { promisify } = require('util')
const axios = require('axios')
const Prompt = require('inquirer/lib/prompts/base')



// axios.get(`https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple`)
// .then(({data}) => {
//     // console.log(data.results)
//     data.results.map(i => {
//         let choicesList = i.incorrect_answers
//         choicesList.push(i.correct_answer)
//         // console.log(choicesList)
//         questions.push(
//             {
//                 type: "list",
//                 message: i.question,
//                 choices: choicesList
//             }
//         )
//         console.log(questions)
//         // console.log(i.question)
//     })
   
// })
// .catch(err => console.log(err))

// prompt({
//     type: "list",
//     name: "questions",
//     message: "pick one",
//     choices: ['a','b','c']
// })

// axios.get(`https://opentdb.com/api_category.php`)
// .then(({data}) => console.log(data))
// .catch(err => console.log(err))

let catChoices = []
let categories = []
let promptQuestions = []
let listQA = []
const getCategories = () =>
{
    axios.get(`https://opentdb.com/api_category.php`)
    .then(({data}) => 
    {
        catagories = data.trivia_categories.forEach(info => {
            catChoices.push(info.name)
            categories.push({id: info.id, name: info.name})
        })
        prompt(
           { type: 'list',
            name: 'choices',
            message: 'Select a category: ',
            choices : catChoices}
        )
        .then(({choices}) => {
            let id 
            categories.forEach((e) => {if (e.name === choices) id = e.id})
            getQuestions(id)
        })
        .catch(err => console.log(err))
    })
}

const getQuestions = (id) =>
{
    axios.get(`https://opentdb.com/api.php?amount=10&category=${id}`)
    .then(({data}) => {
        // console.log(data.results)

        data.results.map(i => {
        let choicesList = i.incorrect_answers
                choicesList.push(i.correct_answer)
                // console.log(choicesList)
                promptQuestions.push(
                    {
                        type: "list",
                        name: 'choices',
                        message: (i.question),
                        choices: choicesList.sort()
                    } )

                    listQA.push(
                        {
                            question: i.question,
                            answer: i.correct_answer
                        }
                    )
        })
            // console.log(promptQuestions)
            // console.log(listQA)
            displayQuestion(promptQuestions,listQA,0 ,promptQuestions.length,0)
            // prompt({promptQuestions})
            // .then(resp => console.log(resp))
            // .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

const check = (question,answer,choices) =>
{
    // console.log(question, answer,choices)
    answer.forEach(i => {
                if(i.question === question)
                {
                 if ( i.answer === choices)  
                 {
                     console.log(chalk.green("Correct answer - " + i.answer))
                     return true
                 }
                 else
                 {
                     console.log(chalk.red('Incorrect answer - ' + i.answer))
                     return false
                 }
                 }
            })
}

const displayQuestion = (data,answer,start,length,score) =>
{
    if(start < length)
   {
     prompt(data[start])
    .then(({choices}) => {
        // console.log(data[start].message)
    //   let check = false
   let  a = check(data[start].message,answer,choices)
      console.log(a)
      
        start++
        console.log(score)
        displayQuestion(data,answer,start,length,score)
    })
    .catch(err => console.log(err))
    }
    else{return}
}



const getLeaderBoard = () =>
{
    console.log("in Leaderboard")
}

let updateLeaderBoard = (data) =>
{

}

let init = () =>
{
    prompt({
        type: 'list',
        name: 'choices',
        message: 'Please select one of the following: ',
        choices : ['New game', 'Leaderboard']
    })
    .then(({choices}) => {
        if(choices === 'New game')
        {
            getCategories()
        }
        if(choices === 'Leaderboard')
        {
            getLeaderBoard()
        }
    })
    .catch(err => console.log(err))
}

init()

