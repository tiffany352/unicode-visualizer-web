import { combineReducers } from 'redux'
import textReducer from './text'
import infoPageReducer from './infoPage'

const reducer = combineReducers({
  text: textReducer,
  infoPage: infoPageReducer
})

export default reducer
