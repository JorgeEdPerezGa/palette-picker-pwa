const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'palette picker';
app.locals.projects = [
  { project_id: 1,
    name: 'project palette',
    color_0: '0',
    color_1: '1',
    color_2: '2',
    color_3: '3',
    color_4: '4'
  },
  { project_id: 1,
    name: 'project palette 2',
    color_0: '0',
    color_1: '1',
    color_2: '2',
    color_3: '3',
    color_4: '4'
  }
]

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.send('palette picker');
})

app.get('/api/v1/projects/:project_id', (request, response) => {
  // let projectId = request.params.project_id
  //knex go find all palettes with projectId 1
  response.send(app.locals.projects);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000`);
});
