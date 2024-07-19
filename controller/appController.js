const userDb = require('../db/usersDb')


exports.identifyAccount =async (req,res) =>{
        const { email, phoneNumber } = req.body;
    
        if (!email && !phoneNumber) {
            return res.status(400).json({ error: 'Email and phone number is required' });
        }
    
        try {
            
            const users = await userDb.getUsersWithPhoneandEmail(phoneNumber,email);

            let primaryContact,secondaryContacts = [];
    
            
            console.log(users,'[userInfo]')
            if (users.length === 0) {
                // No existing user, create a new one
                const insertResult = await userDb.insertIntoUsers(phoneNumber,email,null,"primary");

                console.log(insertResult,'inserted users');

                primaryContact = insertResult.rows[0];
    
            }
    
            else if (users.length === 1) {
                // One existing user, create a new contact and link to the old one
                const existingUser = users[0];

                if(!(existingUser.email === email && existingUser.phonenumber === phoneNumber.toString())){
    
                 await userDb.insertIntoUsers(phoneNumber,email,existingUser.id,"secondary");

                }
               
                primaryContact = existingUser;
            }
    
            else if (users.length === 2 && users[0].linkprecedence === 'primary' && users[1].linkprecedence === 'primary') {
                // Two existing users, link one to the other
                const [user1, user2] = users;
    
                // Make one user primary and the other secondary
                const primaryUser = user1.linkPrecedence === 'primary' ? user1 : user2;
                const secondaryUser = user1.linkPrecedence === 'primary' ? user2 : user1;
    

                await userDb.updateUsers(primaryUser.id, secondaryUser.id);

                secondaryUser.linkPrecedence = 'secondary';
                secondaryUser.linkedId = primaryUser.id;

                primaryContact = primaryUser
    
            }

            else {
                [primaryContact] = users.filter(contact => contact.linkprecedence === 'primary')
                console.log(primaryContact,'exception')
            }

            

             secondaryContacts = await userDb.fetchSecondaryUsers(primaryContact.id);

             const response = formatResponse(primaryContact,secondaryContacts)

            
             return res.status(200).json(response);
        } catch (error) {

            console.error(error)
          
            res.status(500).json({ error: 'Internal Server Error' });
        } 
    
}

const formatResponse = (primaryContact,secondaryContacts) =>{

  return  {
        contact: {
            primaryContactId: primaryContact.id,
            emails: [primaryContact.email, ...secondaryContacts.filter(contact => contact.email !== primaryContact.email).map((obj)=> obj.email)].filter(Boolean),
            phoneNumbers: [primaryContact.phonenumber, ...secondaryContacts.filter((contact) => contact.phonenumber !== primaryContact.phonenumber).map((obj)=> obj.phonenumber)].filter(Boolean),
            secondaryContactIds: secondaryContacts.map(contact => contact.id)
        }
    };

}
