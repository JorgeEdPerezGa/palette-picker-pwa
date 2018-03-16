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

// fetch project
const getProjects = async() => {
  // let project_id = 1;
  // const fetchProjects = await fetch(`/api/v1/projects/${project_id}`);
  const fetchProjects = await fetch(`/api/v1/projects/`);
  const projects = await fetchProjects.json();
  projects.forEach(project => displayProjectOption(project.name));
}

const displayProjectOption = (name) => {
  $('.select-project').prepend(`<option>${name}</option>`)
}

//post a projct
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
//     const url ='/api/v1/projects/';
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

//post palette
// const postPalette = async() => {
//   const palette = {
//     project_id: 2,
//     name: 'project palette',
//     color_0: '0',
//     color_1: '1',
//     color_2: '2',
//     color_3: '3',
//     color_4: '4'
//   }
//
//   await fetch("http://localhost:3000/api/v1/projects/",
//   {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     method: "POST",
//     body: JSON.stringify(palette)
//   })
//   .then(function(res){ console.log(res) })
//   .catch(function(res){ console.log(res) })
// }

window.onload = () => getProjects();
randomColors.addEventListener('click', handleSubmit);
// savePalette.addEventListener('click', postPalette);
saveProject.addEventListener('click', handlePostProject);
$('.lock-button').on('click', lockColor)
