function text (state, action) {
  if (action.type === 'setText') {
    return action.text
  }

  if (action.type === 'normalizeText') {
    return (state || '').normalize(action.form)
  }

  return state || ''
}

export default text
