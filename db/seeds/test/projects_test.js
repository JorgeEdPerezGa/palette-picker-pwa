exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'sample project 1'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { name: 'sample palette 1',
              color_0: '#FF7575',
              color_1: '#CC5C8A',
              color_2: '#AA75FF',
              color_3: '#7D5FDA',
              color_4: '#aae6e6',
              project_id: project[0]
            },
            { name: 'sample palette 2',
              color_0: '#FFFFFF',
              color_1: '#FFFFFF',
              color_2: '#FFFFFF',
              color_3: '#FFFFFF',
              color_4: '#FFFFFF',
              project_id: project[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
