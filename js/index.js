// DOM elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const userList = document.getElementById('user-list');
const repoList = document.getElementById('repo-list');
const toggleSearchModeBtn = document.getElementById('toggle-search-mode');

let searchMode = 'user'; // Default search mode: 'user' (can be 'repo' as well)

// Function to fetch users based on the search query
const searchUsers = async (query) => {
  const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    }
  });
  const data = await response.json();
  return data.items;
};

// Function to fetch repositories for a specific user
const fetchUserRepos = async (username) => {
  const response = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    }
  });
  const data = await response.json();
  return data;
};

// Function to display user search results
const displayUsers = (users) => {
  userList.innerHTML = '';
  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" width="100" />
      <p>${user.login}</p>
      <a href="${user.html_url}" target="_blank">Profile</a>
    `;
    userDiv.addEventListener('click', async () => {
      const repos = await fetchUserRepos(user.login);
      displayRepos(repos);
    });
    userList.appendChild(userDiv);
  });
};

// Function to display repositories of a user
const displayRepos = (repos) => {
  repoList.innerHTML = '<h2>Repositories:</h2>';
  const repoUl = document.createElement('ul');
  repos.forEach(repo => {
    const repoLi = document.createElement('li');
    repoLi.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
    repoUl.appendChild(repoLi);
  });
  repoList.appendChild(repoUl);
};

// Handle form submission to search users or repos based on search mode
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  if (searchMode === 'user') {
    const users = await searchUsers(query);
    displayUsers(users);
  } else {
    const repos = await searchRepos(query);
    displayRepos(repos);
  }
});

// Function to search repositories by keyword
const searchRepos = async (query) => {
  const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    }
  });
  const data = await response.json();
  return data.items;
};

// Toggle the search mode between 'user' and 'repo'
toggleSearchModeBtn.addEventListener('click', () => {
  searchMode = searchMode === 'user' ? 'repo' : 'user';
  toggleSearchModeBtn.textContent = searchMode === 'user' ? 'Search Repos' : 'Search Users';
  searchInput.placeholder = searchMode === 'user' ? 'Search for a user...' : 'Search for a repository...';
});
