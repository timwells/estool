'use strict'

// Public data sets
// https://data.gov.uk/search


// Latest client-side elastic search
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function loadData(indexName, bulkData) {
  const start = Date.now()
  asyncForEach(bulkData, async (item, index, array) => {
    await client.index({
      index: indexName,
      refresh: index===array.length-1,
      body: item  
    })
    console.log('Loaded:',indexName,index)
    if(index===array.length-1) console.log(indexName+ " took:",(Date.now()-start)/1000)
  })
}

// Kibana sample data.
//loadData('cars',require('./data/cars.json'))
//loadData('birdstrike',require('./data/birdstrike.json'))
//loadData('countries',require('./data/countries.json'))

async function doSearch() {
  const { body } = await client.search({
    index: 'cars',
    body: {
      query: {
        match: {
          Cylinders: 8
        }
      }
    }
  })
  console.log(body.hits.hits.length)
}

doSearch()