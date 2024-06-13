import React from 'react'
//import Question from './components/Question'
import {withRouter} from 'react-router-dom'

class QuizApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: [],
      currentQuestionIndex: 0,
      selectedOptions: [],
      score: 0,
      timer: 15,
      isFetching: true,
      isError: false,
    }
  }

  componentDidMount() {
    this.fetchQuestions()
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

  handleOptionClick = optionId => {
    const {currentQuestionIndex, selectedOptions} = this.state
    const currentQuestion = this.getCurrentQuestion()
    const selectedOption = currentQuestion.options.find(
      option => option.id === optionId,
    )

    if (selectedOptions[currentQuestionIndex]) {
      return
    }

    const updatedSelectedOptions = [...selectedOptions]
    updatedSelectedOptions[currentQuestionIndex] = selectedOption

    this.setState(
      prevState => ({
        selectedOptions: updatedSelectedOptions,
        score:
          selectedOption.is_correct === 'true'
            ? prevState.score + 1
            : prevState.score,
      }),
      () => {
        if (currentQuestionIndex === this.state.questions.length - 1) {
          this.props.history.push('/results', {
            score: this.state.score,
            questions: this.state.questions,
            selectedOptions: updatedSelectedOptions,
          })
        } else {
          this.handleNextQuestion()
        }
      },
    )
  }

  handleNextQuestion = () => {
    this.setState(prevState => ({
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
      timer: 15,
    }))
  }

  getCurrentQuestion = () => {
    const {questions, currentQuestionIndex} = this.state
    return questions[currentQuestionIndex]
  }

  handleTimeout = () => {
    const {currentQuestionIndex, questions} = this.state
    if (currentQuestionIndex < questions.length - 1) {
      this.handleNextQuestion()
    } else {
      this.props.history.push('/results', {
        score: this.state.score,
        questions: this.state.questions,
        selectedOptions: this.state.selectedOptions,
      })
    }
  }

  render() {
    const {
      questions,
      currentQuestionIndex,
      selectedOptions,
      isFetching,
      isError,
      timer,
    } = this.state

    if (isFetching) {
      return <div className="loading">Loading...</div>
    }

    if (isError) {
      return (
        <div className="error">
          Error while fetching questions. Please try again.
          <button onClick={this.fetchQuestions}>Retry</button>
        </div>
      )
    }

    return (
      <div className="quiz-app">
        {questions.length > 0 && (
          <Question
            question={this.getCurrentQuestion()}
            selectedOption={selectedOptions[currentQuestionIndex]}
            onOptionClick={this.handleOptionClick}
            onTimeout={this.handleTimeout}
            timer={timer}
            questionNumber={currentQuestionIndex + 1}
          />
        )}
      </div>
    )
  }
}

export default withRouter(QuizApp)
