import React from 'react'
import {Link} from 'react-router-dom'

const GameReports = props => {
  const {questions, selectedOptions} = props.location.state

  return (
    <div className="game-reports">
      <h2>Game Report</h2>
      {questions.map((question, index) => {
        const selectedOption = selectedOptions[index]
        const correctOption = question.options.find(
          option => option.is_correct === 'true',
        )
        const isCorrect = selectedOption && selectedOption.is_correct === 'true'
        const isUnattempted = !selectedOption

        return (
          <div
            key={question.id}
            className={`report-item ${
              isCorrect
                ? 'correct'
                : isUnattempted
                ? 'unattempted'
                : 'incorrect'
            }`}
          >
            <p>
              <strong>Q{index + 1}:</strong> {question.question_text}
            </p>
            <p>
              <strong>Your answer:</strong>{' '}
              {selectedOption ? selectedOption.text : 'Unattempted'}
            </p>
            <p>
              <strong>Correct answer:</strong> {correctOption.text}
            </p>
          </div>
        )
      })}
      <Link to="/" className="button">
        Play Again
      </Link>
    </div>
  )
}

export default GameReports
