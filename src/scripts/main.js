import iconMoon from '../assets/icon-moon.svg';
import iconSun from '../assets/icon-sun.svg';

const toggleTheme = document.querySelector('.button[data-toggle="dark"]');
const searchForm = document.querySelector('.form');

const getJSON = async function (url) {
  try {
    if (!url) throw new Error(`No URL!`);

    const res = await fetch(`${url}`);
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

const formatReadableDate = function (createdAt) {
  const locale = navigator.language;
  const options = {
    dateStyle: 'medium',
  };

  return new Intl.DateTimeFormat(locale, options).format(new Date(createdAt));
};

const renderUserInfo = function (params) {
  const avatarEl = document.querySelector('.devfinder-grid img');
  const nameEl = document.querySelector('.profile h2');
  const desc = document.querySelector('.profile-description');
  const githubEl = document.querySelector('.profile a');
  const joinedEl = document.querySelector('.profile p span');
  const reposEl = document.querySelector('.repos p[data-repos]');
  const followersEl = document.querySelector('.repos [data-followers]');
  const followingEl = document.querySelector('.repos [data-following]');
  const locationEl = document.querySelector('.info [data-location]');
  const websiteEl = document.querySelector('.info [data-website]');
  const twitterUsernameEl = document.querySelector(
    '.info [data-twitterUsername]'
  );
  const companyEl = document.querySelector('.info p[data-company]');

  const formattedDate = formatReadableDate(params.created_at);

  const userInfo = {
    imageUrl: params.avatar_url,
    name: params.name,
    bio: params.bio,
    githubLink: params.login,
    joined: formattedDate,
    repos: params.public_repos,
    followers: params.followers,
    following: params.following,
    location: params.location,
    website: params.blog,
    twitter_username: params.twitter_username,
    company: params.company,
  };

  avatarEl.src = userInfo.imageUrl;
  nameEl.textContent = userInfo.name;
  desc.textContent = userInfo.bio || 'Not Available';
  githubEl.textContent = `@${userInfo.githubLink}`;
  githubEl.href = `https://github.com/${userInfo.githubLink}`;
  joinedEl.textContent = userInfo.joined;
  reposEl.textContent = userInfo.repos;
  followersEl.textContent = userInfo.followers;
  followingEl.textContent = userInfo.following;
  locationEl.textContent = userInfo.location || 'Not Available';
  websiteEl.textContent = userInfo.website || 'Not Available';
  twitterUsernameEl.textContent = userInfo.twitter || 'Not Available';
  companyEl.textContent = userInfo.company || 'Not Available';
};

const getUserFromAPI = async function (e) {
  e.preventDefault();

  try {
    const errorElement = document.querySelector('.error-message');
    const value = this.querySelector('input').value;

    !value
      ? (errorElement.style.display = 'block')
      : (errorElement.style.display = 'none');

    if (!value) throw new Error(`Error: No value entered!`);
    const json = await getJSON(`https://api.github.com/users/${value}`);

    renderUserInfo(json);
  } catch (error) {
    console.error(`${error.message}`);
  }
};

const toggleDarkMode = function () {
  const body = document.querySelector('body');
  const targetButton = body.querySelector('.button[data-toggle="dark"] span');
  const imageButton = body.querySelector('.button[data-toggle="dark"] img');

  body.classList.toggle('dark');

  if (body.classList.contains('dark')) {
    targetButton.textContent = 'light';
    imageButton.src = iconSun;
  }

  if (!body.classList.contains('dark')) {
    targetButton.textContent = 'dark';
    imageButton.src = iconMoon;
  }
};

toggleTheme.addEventListener('click', toggleDarkMode);
searchForm.addEventListener('submit', getUserFromAPI);
