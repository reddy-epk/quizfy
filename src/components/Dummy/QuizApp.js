import React from 'react'
import './index.css'

class QuizApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: [],
      currentQuestionIndex: 0,
      selectedOptions: [],
      isQuizCompleted: false,
      score: 0,
      timer: 15,
      isFetching: true,
      isError: false,
    }
  }

  componentDidMount() {
    this.fetchQuestions()
    this.startTimer()
  }

  componentWillUnmount() {
    clearTimeout(this.timerId)
  }

  fetchQuestions = () => {
    fetch('https://apis.ccbp.in/assess/questions')
      .then(response => response.json())
      .then(data => {
        this.setState({questions: data.questions, isFetching: false})
      })
      .catch(error => {
        console.log('Error while fetching questions:', error)
        this.setState({isError: true, isFetching: false})
      })
  }

  startTimer = () => {
    this.timerId = setInterval(() => {
      this.setState(
        prevState => ({
          timer: prevState.timer - 1,
        }),
        () => {
          if (this.state.timer === 0) {
            this.handleTimeout()
          }
        },
      )
    }, 1000)
  }

  handleTimeout = () => {
    const {currentQuestionIndex, selectedOptions} = this.state
    const currentQuestion = this.getCurrentQuestion()

    if (!selectedOptions[currentQuestionIndex]) {
      this.handleOptionSelect(currentQuestion.id, null)
    }

    if (currentQuestionIndex === this.state.questions.length - 1) {
      this.calculateScore()
    } else {
      this.setState(prevState => ({
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        timer: 15,
      }))
    }
  }

  handleOptionClick = optionId => {
    const {currentQuestionIndex, selectedOptions} = this.state
    const currentQuestion = this.getCurrentQuestion()
    const selectedOption = currentQuestion.options.find(
      option => option.id === optionId,
    )

    // Change 2: Prevent selecting a new option if one is already selected
    if (selectedOptions[currentQuestionIndex]) {
      return
    }

    const updatedSelectedOptions = [...selectedOptions]
    updatedSelectedOptions[currentQuestionIndex] = selectedOption

    this.setState({selectedOptions: updatedSelectedOptions})
  }

  // Change 1: Add method to handle next question
  handleNextQuestion = () => {
    const {currentQuestionIndex, questions} = this.state
    if (currentQuestionIndex < questions.length - 1) {
      this.setState(prevState => ({
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        timer: 15,
      }))
    } else {
      this.calculateScore()
    }
  }

  calculateScore = () => {
    const {questions, selectedOptions} = this.state
    let score = 0

    questions.forEach((question, index) => {
      const selectedOption = selectedOptions[index]
      if (selectedOption && selectedOption.is_correct === 'true') {
        score += 1
      }
    })

    this.setState({score, isQuizCompleted: true})
  }

  getCurrentQuestion = () => {
    const {questions, currentQuestionIndex} = this.state
    return questions[currentQuestionIndex]
  }

  handleRetry = () => {
    this.setState({
      questions: [],
      currentQuestionIndex: 0,
      selectedOptions: [],
      isQuizCompleted: false,
      score: 0,
      timer: 15,
      isFetching: true,
      isError: false,
    })
    this.fetchQuestions()
    this.startTimer()
  }

  renderQuizQuestions = () => {
    const {currentQuestionIndex, selectedOptions, timer, questions} = this.state
    const currentQuestion = this.getCurrentQuestion()

    // Change 3: Determine the correct option
    const correctOption = currentQuestion.options.find(
      option => option.is_correct === 'true',
    )

    return (
      <div>
        <h2>Question {currentQuestionIndex + 1}</h2>
        <p>{currentQuestion.question_text}</p>
        {currentQuestion.options_type === 'DEFAULT' ? (
          <ul>
            {currentQuestion.options.map(option => (
              <li
                key={option.id}
                onClick={() => this.handleOptionClick(option.id)}
                style={{
                  backgroundColor:
                    selectedOptions[currentQuestionIndex] &&
                    (selectedOptions[currentQuestionIndex].id === option.id ||
                      (selectedOptions[currentQuestionIndex].is_correct !==
                        'true' &&
                        option.is_correct === 'true'))
                      ? option.is_correct === 'true'
                        ? '#1c944b'
                        : '#bf2626'
                      : '',
                }}
              >
                {option.text}
                {selectedOptions[currentQuestionIndex] &&
                  selectedOptions[currentQuestionIndex].id === option.id && (
                    <img
                      src={
                        option.is_correct === 'true'
                          ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
                          : 'https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png '
                      }
                      alt=""
                    />
                  )}
              </li>
            ))}
          </ul>
        ) : currentQuestion.options_type === 'IMAGE' ? (
          <ul>
            {currentQuestion.options.map(option => (
              <li
                key={option.id}
                onClick={() => this.handleOptionClick(option.id)}
                style={{
                  backgroundColor:
                    selectedOptions[currentQuestionIndex] &&
                    (selectedOptions[currentQuestionIndex].id === option.id ||
                      (selectedOptions[currentQuestionIndex].is_correct !==
                        'true' &&
                        option.is_correct === 'true'))
                      ? option.is_correct === 'true'
                        ? '#1c944b'
                        : '#bf2626'
                      : '',
                }}
              >
                <img src={option.image_url} alt={option.text} />
                {selectedOptions[currentQuestionIndex] &&
                  selectedOptions[currentQuestionIndex].id === option.id && (
                    <img
                      src={
                        option.is_correct === 'true'
                          ? 'right-checked-circle.png'
                          : 'wrong-close-circle.png'
                      }
                      alt=""
                    />
                  )}
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {currentQuestion.options.map(option => (
              <li
                key={option.id}
                onClick={() => this.handleOptionClick(option.id)}
                style={{
                  backgroundColor:
                    selectedOptions[currentQuestionIndex] &&
                    (selectedOptions[currentQuestionIndex].id === option.id ||
                      (selectedOptions[currentQuestionIndex].is_correct !==
                        'true' &&
                        option.is_correct === 'true'))
                      ? option.is_correct === 'true'
                        ? '#1c944b'
                        : '#bf2626'
                      : '',
                }}
              >
                {option.text}
                {selectedOptions[currentQuestionIndex] &&
                  selectedOptions[currentQuestionIndex].id === option.id && (
                    <img
                      src={
                        option.is_correct === 'true'
                          ? 'right-checked-circle.png'
                          : 'wrong-close-circle.png'
                      }
                      alt=""
                    />
                  )}
              </li>
            ))}
          </ul>
        )}
        <p>Timer: {timer} seconds</p>
        {/* Change 1: Enable Next button when an option is selected */}
        <button
          onClick={this.handleNextQuestion}
          disabled={!selectedOptions[currentQuestionIndex]}
        >
          Next Question
        </button>
      </div>
    )
  }

  renderQuizResult = () => {
    const {questions, selectedOptions, score} = this.state
    const totalQuestions = questions.length
    const attemptedQuestions = selectedOptions.filter(Boolean).length
    const unattemptedQuestions = totalQuestions - attemptedQuestions
    const wrongQuestions = attemptedQuestions - score
    const percentageScore = (score / totalQuestions) * 100

    return (
      <div>
        <h2>Quiz Result</h2>
        <p>Total Questions: {totalQuestions}</p>
        <p>Attempted Questions: {attemptedQuestions}</p>
        <p>Unattempted Questions: {unattemptedQuestions}</p>
        <p>Wrong Questions: {wrongQuestions}</p>
        <p>Score: {percentageScore}%</p>
        <button onClick={this.handleRetry}>Retry</button>
      </div>
    )
  }

  render() {
    const {
      questions,
      currentQuestionIndex,
      isQuizCompleted,
      isFetching,
      isError,
    } = this.state

    if (isFetching) {
      return <div>Loading...</div>
    }

    if (isError) {
      return (
        <div>
          Error while fetching questions. Please try again.
          <button onClick={this.handleRetry}>Retry</button>
        </div>
      )
    }

    return (
      <div>
        {questions.length > 0 && !isQuizCompleted
          ? this.renderQuizQuestions()
          : this.renderQuizResult()}
      </div>
    )
  }
}

export default QuizApp
