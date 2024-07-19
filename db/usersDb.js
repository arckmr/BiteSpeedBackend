const conn = require('../connections/elephantsql');


exports.getUsersWithPhoneandEmail = (phone,email) =>{

    const query =
     `
        SELECT * FROM users 
        WHERE email = $1 OR phoneNumber = $2
     `;

     return conn.query(query,[email,phone]);
}


exports.insertIntoUsers = (phone,email,primaryUserId,linkPrecedence) =>{
    console.log(phone,email,primaryUserId,linkPrecedence,'insertIntoUsers')
    const query = `
    INSERT INTO users (email, phoneNumber, linkPrecedence,linkedId)
    VALUES ($1, $2, $3,$4)
    RETURNING *
   `;

   return conn.query(query,[email,phone,linkPrecedence,primaryUserId])
}

exports.updateUsers = (primaryUserId, secondaryUserId) =>{
    const query = `UPDATE users SET linkedId = $1, linkPrecedence = $2
    WHERE id = $3`;

    return conn.query(query,[primaryUserId,'secondary',secondaryUserId])
}

exports.fetchSecondaryUsers = (primaryUserId) =>{

    const query =  ` SELECT * FROM users 
    WHERE linkedId = $1
    `;

    return conn.query(query,[primaryUserId])
}
