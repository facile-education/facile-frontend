const exactString = (string) => {
  return new RegExp('^' + string + '$', 'g') // to use with "contain" assertion to fetch the entire string
}

export {
  exactString
}
