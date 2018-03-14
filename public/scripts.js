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
    $(`.color-box-${i}`).css('background-color', color)
    $(`.color-code-${i}`).text(color)
  }
}

// fetch project
const getProjects = async() => {
  let project_id = 1;
  const fetchProjects = await fetch(`/api/v1/projects/${project_id}`);
  const projects = await fetchProjects.json();
  console.log(projects);
}

window.onload = () => getProjects();
randomColors.addEventListener('click', handleSubmit);
