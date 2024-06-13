import React from 'react'
import {Link} from 'react-router-dom'

const QuizResults = props => {
  const {score, questions} = props.location.state
  const totalQuestions = questions.length
  const hasWon = score > 5

  return (
    <div className={`quiz-results ${hasWon ? 'won' : 'lost'}`}>
      <h2>{hasWon ? 'Congratulations!' : 'Better luck next time!'}</h2>
      <p>{hasWon ? 'You won the game!' : 'You lost the game.'}</p>
      <p className="score">
        Your score: {score}/{totalQuestions}
      </p>
      <div className="buttons">
        <Link to="/" className="button">
          Play Again
        </Link>
        <Link
          to={{
            pathname: '/report',
            state: props.location.state,
          }}
          className="button"
        >
          View Report
        </Link>
      </div>
    </div>
  )
}

export default QuizResults
