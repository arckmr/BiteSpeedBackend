const config = require('../config');



var {Client} = require('pg');




const conString =  config.elephantSQLURL

const client = new Client({
  connectionString: conString,
  resultFormat: 'detailed'
});


client.connect();

exports.query = async (query, args) => {
  try {
    
    const result = await client.query(query, args);

    console.log(query, args);
    

    if (query.trim().startsWith('INSERT') || query.trim().startsWith('UPDATE')) {
      console.log('Number of affected rows:', result.rowCount);
    //   client.end();
      return result;
    } else {
      console.log('Query results:', result.rows);
      return result.rows;
    }
  } catch (err) {
    console.error('Error executing query:', err);
    throw err; // Rethrow the error to handle it in the calling code
  }
};

