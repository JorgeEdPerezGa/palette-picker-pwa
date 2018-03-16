// initial const
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//check if there is an existing enviroment and if not redirects to localhost 3000
app.set('port', process.env.PORT || 3000);
//body parser allows to be read as json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.title = 'palette picker';

//set up an enviroment for development
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

//this allows express to use index.html in the public folder
app.use(express.static('public'));

// make a get request and send palette picker
app.get('/', (request, response) => {
  response.send('palette picker');
})

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => response.status(500).json({ error }))
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  console.log('project');
  if (!project.name) {
    return response
      .status(422)
      .send({ error: `You're missing a "projct name" property.` });
  }

  database('projects').insert(project, '*')
    .then(responseProject => {
      response.status(201).json(responseProject[0])
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes)
      } else {
        return response.status(404).json({ error: 'not found' })
      }
    })
    .catch(error => response.status(500).json({ error }))
})

app.get('/api/v1/projects/:project_id/palettes', (request, response) => {
  // let projectId = request.params.project_id
  //knex go find all palettes with projectId 1
  response.send(app.locals.projects);
})

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  //this is my param in the fetch call

  let palette = request.body
  let paletteTemplate = ['name', 'color_0', 'color_1', 'color_2', 'color_3', 'color_4']
  console.log(palette);
  //I want to make sure that when they are pasing in the body it contains the name and 5 colors
  for (requiredParam of paletteTemplate) {
    if (!palette[requiredParam]) {
      return response.status(422).json({ error: `incomplete palette, missing ${requiredParam}` })
    }
  }
  palette = Object.assign({}, palette, {project_id:request.params.id});
  return database('palettes').insert(palette, '*')
    .then(paletteResponse => response.status(201).json(paletteResponse[0]))
    .catch(error => response.status(500).json({ error }))
})

app.delete('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).del()
    .then(palette => {
      if(palette) {
        return response.sendStatus(200);
      } else {
        return response.sendStatus(404);
      }
    })
    .catch(error => response.status(500).json({ error }))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000`);
});

module.exports = app;
