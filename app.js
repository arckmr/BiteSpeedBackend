const express = require('express');
const app = express();
const appRoutes = require('./routes/appRoutes');
const config = require('./config');




app.use(express.json());

 
 app.use('', appRoutes);
// app.use('/api/assignment', assigmentRoutes);
// app.use('/api/submission', submissionRoutes);



const PORT = process.env.PORT || config.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});