const BASE_URL = 'https://user-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/users/';

const users = JSON.parse(localStorage.getItem('favoriteUsers')) || [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#keyword");
const searchInput = document.querySelector('#search-input');

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <div class="col-md-auto">
        <div class="mb-2">
          <div class="card">
            <img
              src="${item.avatar}"
              class="card-img-top"
              alt="User Poster"
              data-id="${item.id}/>
            <div class="card-body">
            </div>
              <div class="card-footer" style="background-color: rgba(0, 0, 0, 0.753); display: flex; justify-content: space-between; align-items: center;">
               <h5 class="card-title">${item.name}</h5>
                <div>
                 <button class="btn btn-primary btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">More</button>
                  <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
                </div>
             </div>
        </div>
     </div>`
  });
  dataPanel.innerHTML = rawHTML;
}

function showUserModal(id) {
  const modalTitle = document.querySelector("#user-modal-title");
  const modalId = document.querySelector("#user-modal-id");
  const modalName = document.querySelector("#user-modal-name");
  const modalSurname = document.querySelector("#user-modal-surname");
  const modalEmail = document.querySelector("#user-modal-email");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalAge = document.querySelector("#user-modal-age");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalBirthday = document.querySelector("#user-modal-birthday");
  const modalAvatar = document.querySelector("#user-modal-avatar");


  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;

    modalTitle.innerText = `${data.name}`;
    modalId.innerText = `ID: ${data.id}`;
    modalName.innerText = `Name: ${data.name}`;
    modalSurname.innerText = `Surname: ${data.surname}`;
    modalEmail.innerHTML = `Email: ${data.email}`;
    modalGender.innerHTML = `Gender: ${data.gender}`;
    modalAge.innerHTML = `Age: ${data.age}`;
    modalRegion.innerHTML = `Region: ${data.region}`;
    modalBirthday.innerHTML = `Birthday: ${data.birthday}`;
    modalAvatar.src = `${data.avatar}`;
    console.log(data)
    console.log(data.avatar)
  });
}

function removeFromFavorite(id) {
  const userIndex = users.findIndex((user) => user.id === id);
  users.splice(userIndex, 1)
  localStorage.setItem("favoriteUsers", JSON.stringify(users))
  renderUserList(users)
};

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

renderUserList(users)