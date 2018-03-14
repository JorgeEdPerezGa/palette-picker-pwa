const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'palette picker';

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.send('palette picker');
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000`);
});
