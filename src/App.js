import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import QuizApp from './components/QuizApp'
import QuizResults from './components/QuizResults'
import GameReports from './components/GameReports'
import NotFound from './components/NotFound'

const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/" component={QuizApp} />
          <Route path="/results" component={QuizResults} />
          <Route path="/report" component={GameReports} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  )
}

export default App

/*
const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/quiz-game" component={QuizGame} />
    <Route component={NotFound} />
  </Switch>
)

export default App
*/
