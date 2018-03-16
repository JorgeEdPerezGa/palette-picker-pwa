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
  let project_id = 1;
  // const fetchProjects = await fetch(`/api/v1/projects/${project_id}`);
  const fetchProjects = await fetch(`/api/v1/projects/`);
  const projects = await fetchProjects.json();
  console.log(projects);
}

//post palette
const postPalette = () => {
  const palette = {
    project_id: 2,
    name: 'project palette',
    color_0: '0',
    color_1: '1',
    color_2: '2',
    color_3: '3',
    color_4: '4'
  }

  fetch("http://localhost:3000/api/v1/projects/",
  {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(palette)
  })
  .then(function(res){ console.log(res) })
  .catch(function(res){ console.log(res) })
}

window.onload = () => getProjects();
randomColors.addEventListener('click', handleSubmit);
saveProject.addEventListener('click', postPalette);
$('.lock-button').on('click', lockColor)
