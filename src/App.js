import React, { useEffect, useReducer } from 'react';
import Header from './Components/Header';
import Main from './Components/Main';
import Loader from './Components/Loader';
import Error from './Components/Error';
import StartScreen from './Components/StartScreen';
import Question from './Components/Question';
import NextButton from './Components/NextButton';
import Progress from './Components/Progress';
import FinishScreen from './Components/FinishScreen';
const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index:0,
  answer: null,
  points: 0,
  highscore:0
};

function reducer(state, action) {
  switch(action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case 'dataFailed':
      return {
        ...state,
        status: "error",
      };

      case 'start' :
         return {...state, status: "active"};
         case "newAnswer" :
          const question = state.questions.at(state.index);
          return {...state, answer: action.payload,
            points: action.payload === question.correctOption ? state.points + question.points : state.points,
          };

          case 'nextQuestion' :
            return {...state,index: state.index +1, answer:null};

            case 'finished':
              return {...state, status: "finished",highscore: 
              state.points > state.highscore ? state.points : state.highscore,};
              case 'restart':

              return {...initialState, status: "ready", questions: state.questions}
                // return {...state,index:0,
                //   answer: null,
                //   points: 0,
                //   highscore:0,status: "ready",}

    default:
      throw new Error('Action unknown');
  }
}

function App() {
  const [{ questions, status,index,answer, points, highscore}, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur)=>prev + cur.points, 0)
  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  console.log(status);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
        {status === "active" && 
        <>
        <Progress index={index} numQustions={numQuestions} 
        points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}/>
        <Question
         question={questions[index]} dispatch={dispatch} answer={answer} />
         <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index}/>
         </>
         }
         { status === 'finished' && <FinishScreen points={points}
          maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch}/>}
      </Main>
    </div>
  );
}

export default App;
