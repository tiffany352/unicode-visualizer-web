function infoPage (state, action) {
  if (action.type === 'setInfoPage') {
    if (action.page) {
      return {
        page: action.page,
        value: action.value
      }
    }
    else {
      return null
    }
  }
  
  return state || null
}

export default infoPage
