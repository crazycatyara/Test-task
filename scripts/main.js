/* const form = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const resultTemplate = document.querySelector('#result-template').content;

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const searchText = searchInput.value;
	if (!searchText) {
		return;
	}

	const xhr = new XMLHttpRequest();

	xhr.open('GET', `https://api.github.com/search/repositories?q=${searchText}`);

	xhr.onload = function () {
		if (xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			searchResults.innerHTML = '';

			response.items.forEach((item) => {
				const resultElement = resultTemplate.cloneNode(true);
				const titleElement = resultElement.querySelector('.title');
				const authorElement = resultElement.querySelector('.author');
				const starsElement = resultElement.querySelector('.stars');
				const watchersElement = resultElement.querySelector('.watchers');
				const descriptionElement = resultElement.querySelector('.description');
				const languageElement = resultElement.querySelector('.language');
				const updatedElement = resultElement.querySelector('.updated');
				const forksElement = resultElement.querySelector('.forks');
				const detailsButton = resultElement.querySelector('.details');
				const detailsPanel = resultElement.querySelector('.details-panel');

				titleElement.textContent = item.name;
				authorElement.textContent = `Автор: ${item.owner.login}`;
				starsElement.textContent = `Звезды: ${item.stargazers_count}`;
				watchersElement.textContent = `Просмотры: ${item.watchers_count}`;
				descriptionElement.textContent = `Описание: ${item.description}`;
				languageElement.textContent = `Язык: ${item.language}`;
				updatedElement.textContent = `Обновлено: ${item.updated_at}`;
				forksElement.textContent = `Форки: ${item.forks_count}`;

				detailsButton.addEventListener('click', () => {
					detailsPanel.classList.toggle('hidden');
				});

				searchResults.appendChild(resultElement);
			});
		} else {
			searchResults.innerHTML = `<p class="error">Не удалось выполнить запрос</p>`;
		}
	};

	xhr.onerror = function () {
		searchResults.innerHTML = `<p class="error">Не удалось выполнить запрос</p>`;
	};

	xhr.send();
});

 */
const form = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const resultTemplate = document.querySelector('#result-template').content;
const pagination = document.querySelector('#pagination');

let currentPage = 1;
const resultsPerPage = 8;

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const searchText = searchInput.value;
	const xhr = new XMLHttpRequest();

	xhr.open('GET', `https://api.github.com/search/repositories?q=${searchText}`);

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			const totalResults = response.total_count;
			const totalPages = Math.ceil(totalResults / resultsPerPage);

			renderPagination(response.items, totalPages);
			renderResults(response.items);
		}
	};

	xhr.onerror = function () {
		console.error('Ошибка при запросе на сервер');
	};

	xhr.send();
});

function renderResults(items) {
	searchResults.innerHTML = '';

	const startIndex = (currentPage - 1) * resultsPerPage;
	const endIndex = startIndex + resultsPerPage;
	const resultsToRender = items.slice(startIndex, endIndex);

	resultsToRender.forEach((item) => {
		const resultElement = resultTemplate.cloneNode(true);
		const titleElement = resultElement.querySelector('.title');
		const authorElement = resultElement.querySelector('.author');
		const authorAvatar = document.createElement('img');
		const authorName = document.createElement('span');
		const starsElement = resultElement.querySelector('.stars');
		const watchersElement = resultElement.querySelector('.watchers');
		const descriptionElement = resultElement.querySelector('.description');
		const languageElement = resultElement.querySelector('.language');
		const updatedElement = resultElement.querySelector('.updated');
		const forksElement = resultElement.querySelector('.forks');
		const detailsButton = resultElement.querySelector('.details');

		titleElement.textContent = item.name;
		authorName.textContent = `Автор: ${item.owner.login}`;
		starsElement.textContent = `Звезды: ${item.stargazers_count}`;
		watchersElement.textContent = `Просмотры: ${item.watchers_count}`;
		descriptionElement.textContent = `Описание: ${item.description}`;
		languageElement.textContent = `Язык: ${item.language}`;
		updatedElement.textContent = `Обновлено: ${item.updated_at}`;
		forksElement.textContent = `Форки: ${item.forks_count}`;

		authorAvatar.src = item.owner.avatar_url; // set avatar image URL
		authorElement.appendChild(authorAvatar);
		authorElement.appendChild(authorName);

		authorElement.addEventListener('click', () => {
			window.open(item.owner.html_url, '_blank');
		});

		titleElement.addEventListener('click', () => {
			window.open(item.html_url, '_blank');
		});

		searchResults.appendChild(resultElement);
	});
}

function renderPagination(items, totalPages) {
	pagination.innerHTML = '';

	for (let i = 1; i <= Math.min(totalPages, 4); i++) {
		const pageLink = document.createElement('a');
		pageLink.href = '#';
		pageLink.textContent = i;
		if (i === currentPage) {
			pageLink.classList.add('active');
		}
		pageLink.addEventListener('click', () => {
			currentPage = i;
			renderResults(items);
			renderPagination(items, totalPages);
		});
		pagination.appendChild(pageLink);
	}
}