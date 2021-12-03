import nlp from 'compromise'
import compromiseDates from 'compromise-dates'
import compromiseNumbers from 'compromise-numbers'

nlp.extend(compromiseDates)
nlp.extend(compromiseNumbers)

let myWords = {
  betsey: 'FirstName',
}

const findEntities = async (text) => {
  let doc = nlp(text, myWords)
  const results = {
    people: doc.people().json({offset:true}),
    places: doc.places().json({offset:true}),
    organizations: doc.organizations().json({offset:true}),
    dates: doc.dates().json({offset:true})
  }
  
  return results
}

export default findEntities