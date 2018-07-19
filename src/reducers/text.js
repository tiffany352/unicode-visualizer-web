function text (state, action) {
  if (action.type === 'setText') {
    return action.text
  }

  return state || ''
}

export default text
