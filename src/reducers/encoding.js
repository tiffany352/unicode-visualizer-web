function encoding (state, action) {
    if (action.type === 'setEncoding') {
      return action.encoding
    }
  
    return state || 'UTF-16'
  }
  
  export default encoding
  