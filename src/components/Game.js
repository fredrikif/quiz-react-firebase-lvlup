import React, { useState, useEffect, useCallback } from 'react'
import Question from './Question'
import { loadQuestions } from '../helpers/QuestionsHelper'
import HUD from './HUD'
import SaveScoreForm from './SaveScoreForm'

export default function Game({ history }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    loadQuestions()
      .then(setQuestions) // automatically passes in questions to setQuestions
      .catch(console.error) // automatically passes error to console.error
  }, []) // passing empty array = empty dependencies, implies will only be called once

  const scoreSaved = () => {
    history.push('/')
  }

  const changeQuestion = useCallback(
    (bonus = 0) => {
      if (questions.length === 0) {
        setDone(true)
        return setScore(score + bonus)
      }

      const randomQuestionIndex = Math.floor(Math.random() * questions.length)
      const currentQuestion = questions[randomQuestionIndex]
      const remainingQuestions = [...questions]
      remainingQuestions.splice(randomQuestionIndex, 1)

      setQuestions(remainingQuestions)
      setCurrentQuestion(currentQuestion)
      setLoading(false)
      setScore(score + bonus)
      setQuestionNumber(questionNumber + 1)
    },
    [
      score,
      questionNumber,
      questions,
      setQuestions,
      setLoading,
      setCurrentQuestion,
      setQuestionNumber
    ]
  )

  // If we have questions, but not a currentQuestion, initiates game
  useEffect(() => {
    if (!currentQuestion && questions.length) {
      changeQuestion()
    }
  }, [currentQuestion, questions, changeQuestion])

  return (
    <>
      {loading && !done && <div id="loader"></div>}

      {!done && !loading && currentQuestion && (
        <div>
          <HUD score={score} questionNumber={questionNumber} />
          <Question
            question={currentQuestion}
            changeQuestion={changeQuestion}
          />
        </div>
      )}

      {done && <SaveScoreForm score={score} scoreSaved={scoreSaved} />}
    </>
  )
}
