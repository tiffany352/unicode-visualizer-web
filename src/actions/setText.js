function setText (text, confirm) {
  return {
    type: 'setText',
    text: text,
    confirm: confirm || false
  }
}

export default setText
