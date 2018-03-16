// generate a random color
const randomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// update ui
const handleSubmit = () => {
  for (var i = 0; i < 5; i++) {
    const color = randomColor();
    if(!$(`.color-box-${i}`).hasClass('.locked')) {
      $(`.color-box-${i}`).css('background-color', color)
      $(`.color-code-${i}`).text(color)
    }
  }
}

// lock color
function lockColor() {
  var colorBoxId = $(this).attr('color-box-id');
  $(`.${colorBoxId}`).toggleClass('.locked');
}

//fetch project
const fetchProjects = async() => {
  const url = '/api/v1/projects/';
  const fetchProjects = await fetch(url);
  return await fetchProjects.json();
}

// get poject options
const getProjects = async() => {
  const projects = await fetchProjects();
  projects.forEach(project => {
    displayProjectOption(project)
    getPalettes(project)
  })
}

//get palettes
const getPalettes = async(project) => {
  const url = `/api/v1/projects/${project.id}/palettes`;
  const fetchPalettes = await fetch(url);
  const palettes = await fetchPalettes.json();
  displayPalettes(palettes, project);
}

const displayProjectOption = (project) => {
  const { name, id } = project
  $('.select-project').prepend(`<option class="${id}">${name}</option>`)
}

const displayPalettes = (palettes, project) => {
  console.log(palettes);
  return palettes.map(palette => {
    const { name,
            color_0,
            color_1,
            color_2,
            color_3,
            color_4 } = palette;

    $('.preview-project-container').prepend(`
      <p class="project-name">${project.name}</p>
      <article class="project-container">
        <p class="palette-name">${name}</p>
        <article class="small-pallete">
          <div
            class="color-box-small"
            style="background-color:${color_0}"></div>
          <div
            class="color-box-small-1"
            style="background-color:${color_1}"></div>
          <div
            class="color-box-small-2"
            style="background-color:${color_2}"></div>
          <div
            class="color-box-small-3"
            style="background-color:${color_3}"></div>
          <div
            class="color-box-small-4"
            style="background-color:${color_4}"></div>
        </article>
        <button class="delete-project-button"></button>
      </article>
    `)
  })
}

//post a project
const handlePostProject = async () => {
  try {
    const projectName = projectNameInput.value;
    console.log(projectName);
    const url ='/api/v1/projects/';

    const postProject = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name: projectName})
    });
    if (postProject.status > 299) {
      throw new Error('could not post palette');
    } else {
      const updatedProjects = await postProject.json();
      return getProjects(updatedProjects);
    }
  } catch (error) {
    throw (error);
  }
}

//post paletter
// const postPalette = async () => {
//   try {
//     const fakePalette = {
//       name: 'project palette',
//         color_0: '0',
//         color_1: '1',
//         color_2: '2',
//         color_3: '3',
//         color_4: '4' };
//     console.log(projectName);
    // const url ='/api/v1/projects/';
//
//     const postPalette = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({name: projectName})
//     });
//     if (postPalette.status > 299) {
//       throw new Error('could not post palette');
//     } else {
//       return await postPalette.json();
//     }
//   } catch (error) {
//     throw (error);
//   }
// }

window.onload = () => {
  getProjects();

}
randomColors.addEventListener('click', handleSubmit);
// savePalette.addEventListener('click', postPalette);
saveProject.addEventListener('click', handlePostProject);
$('.lock-button').on('click', lockColor)
