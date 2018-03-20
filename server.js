// access express in out app
const express = require('express');
// app - the instance of our Express application
const app = express();
// ability to parse the body of an HTTP request
const bodyParser = require('body-parser');

app.get("*", function (req, res, next) {
  res.redirect("https://" + req.headers.host + "/" + req.path);
});

// check if there is an existing enviroment and if not redirects to localhost 3000
app.set('port', process.env.PORT || 3000);

// let app know to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cretae a variable, assigned it to the title 'palette picker'
app.locals.title = 'palette picker';

// set up an enviroment for development
const environment = process.env.NODE_ENV || 'development';
// based on the environment provided, fetch the database configuration from knexfile.js
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

//this allows express to use index.html in the public folder
app.use(express.static('public'));

// make a get request and send palette picker
app.get('/', (request, response) => {
  response.send('palette picker');
})

// make a get request to the path projects
app.get('/api/v1/projects', (request, response) => {
  // in database select all 'projects'
  database('projects').select()
    // successful request returns an OK status and set response type as application/json
    .then(projects => response.status(200).json(projects))
    // when unsuccessful, throws an Internal Server Error status and set response type as application/json
    .catch(error => response.status(500).json({ error }))
})

// make a post request to the path projects
app.post('/api/v1/projects', (request, response) => {
  // assign projects to request.body
  const project = request.body;
  // if project does not exist
  if (!project.name) {
    // throw an Unprocessable Entity status error
    return response
      .status(422)
      .send({ error: `You're missing a "projct name" property.` });
  }
  // in database projects add a project to all
  database('projects').insert(project, '*')
    // successful post returns an Created status and set response type as application/json
    .then(responseProject => {
      response.status(201).json(responseProject[0])
    })
    // if unsuccessful, throws an Internal Server Error status and set response type as application/json
    .catch(error => {
      response.status(500).json({ error });
    });
});

// make a get request to the dynamic path of palettes which will vary depending on an specific id provided
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  // in database palettes select all specific palettes with given project id
  database('palettes').where('project_id', request.params.id).select()
    // successful request with at least one palette, return an OK status and set response type as application/json
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes)
      } else {
        // if there are not any palettes related to an specific project id, trow a Not Found status error relating that specific project
        return response.status(404).json({ error: 'not found' })
      }
    })
    // if completely unsuccessful, throw an Internal Server Error status and set response type as application/json
    .catch(error => response.status(500).json({ error }))
})

// make a post request to the dynamic path of palettes which will vary depending on an specific id provided
app.post('/api/v1/projects/:id/palettes', (request, response) => {
  // param in the fetch call
  let palette = request.body
  // each palette will be composed of a name and five different colors
  let paletteTemplate = ['name', 'color_0', 'color_1', 'color_2', 'color_3', 'color_4']
  // loop through the paletteTemplate and go over each index
  for (requiredParam of paletteTemplate) {
    // if palette is missing and index form the array
    if (!palette[requiredParam]) {
      // throw a Unprocessable Entity status error, specifying what the palette is missing
      return response.status(422).json({ error: `incomplete palette, missing ${requiredParam}` })
    }
  }
  // create a new object with the pallete and assign it to a project through an id related to the project
  palette = Object.assign({}, palette, {project_id:request.params.id});
  // in database insert a palette
  return database('palettes').insert(palette, '*')
    // successful post returns an Created status and set response type as application/json
    .then(paletteResponse => response.status(201).json(paletteResponse[0]))
    // if completely unsuccessful, throw an Internal Server Error status and set response type as application/json
    .catch(error => response.status(500).json({ error }))
})

// make a delete request to the dynamic path of palettes which will vary depending on an specific id provided
app.delete('/api/v1/palettes/:id', (request, response) => {
  // in database remove the id that matches the unique palette id
  database('palettes').where('id', request.params.id).del()
    // successful request with at least one palette, return an OK status and set response type as application/json
    .then(palette => {
      if(palette) {
        return response.sendStatus(200);
      } else {
        // if there are not any palettes related to an specific project id, trow a Not Found status error relating that specific project
        return response.sendStatus(404);
      }
    })
    // if completely unsuccessful, throw an Internal Server Error status and set response type as application/json
    .catch(error => response.status(500).json({ error }))
})

// This app starts a server and listens on port 3000 for connections.
app.listen(app.get('port'), () => {
  // in terminal console.log 'palette picker server is running on port 3000' to indicate it successfully started
  console.log(`${app.locals.title} server running on port 3000`);
});

//module.exports is an object that the current module returns when it is needed in another module.
module.exports = app;
