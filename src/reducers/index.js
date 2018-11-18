import { combineReducers } from 'redux'
import textReducer from './text'
import infoPageReducer from './infoPage'
import encodingReducer from './encoding'

const reducer = combineReducers({
  text: textReducer,
  infoPage: infoPageReducer,
  encoding: encodingReducer
})

export default reducer
