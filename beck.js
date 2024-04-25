const BASE_URL = 'https://user-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/users/';
const USERS_PER_PAGE = 12;
const users = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#keyword");
const searchInput = document.querySelector('#search-input');
const paginator = document.querySelector('#paginator');
let filteredUsers = [];
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
              data-id="${item.id
      }
            />
            <div class="card-body">
   
            </div>
              <div class="card-footer" style="background-color: rgba(0, 0, 0, 0.753); display: flex; justify-content: space-between; align-items: center;">
               <h5 class="card-title">${item.name}</h5>
                <div>
                 <button class="btn btn-primary btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">More</button>
                  <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                </div>
              </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  //製作 template
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}

function getUsersByPage(page) {
  //計算起始 index
  const startIndex = (page - 1) * USERS_PER_PAGE
  //回傳切割後的新陣列
  const data = filteredUsers.length ? filteredUsers : users
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUsers")) || [];
  const user = users.find((user) => user.id === id);
  if (list.some((user) => user.id === id)) {
    return alert("此角色已經在收藏清單中！")
  };
  list.push(user);
  localStorage.setItem("favoriteUsers", JSON.stringify(list))

};

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderUserList(getUsersByPage(page))
})


searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword.length) {
    alert("Please enter a valid string");
    return;
  } else {
    filteredUsers = users.filter(user => {
      return user.name.toLowerCase().includes(keyword);
    });

    if (filteredUsers.length === 0) {
      alert("Can't find any user with the keyword");
    } else {
      renderUserList(filteredUsers);
    }
  }
  renderPaginator(filteredUsers.length);
  renderUserList(getUsersByPage(1));
});

axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results);
  renderUserList(users);
  renderPaginator(users.length);
  renderUserList(getUsersByPage(1))
});

