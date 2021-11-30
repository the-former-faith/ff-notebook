import nlp from 'compromise'

let myWords = {
  betsey: 'FirstName',
}

const findEntities = async (text) => {
  let doc = nlp(text, myWords)
  console.log(doc.people().json())
}

export default findEntities