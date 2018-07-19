import { combineReducers } from 'redux'
import textReducer from './text'

const reducer = combineReducers({
  text: textReducer
})

export default reducer
