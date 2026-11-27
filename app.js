// ===== Ссылки на DOM =====
const loadBtn = document.getElementById("load-btn");
const postsContainer = document.getElementById("posts");
const messageEl = document.getElementById("message");
const form = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const formError = document.getElementById("form-error");

const GET_URL = "https://jsonplaceholder.typicode.com/posts?_limit=5";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";

// ===== Вспомогательные функции =====
function showMessage(text, type = "") {
  messageEl.textContent = text;
  messageEl.className = "message" + (type ? " " + type : "");
}

function clearPosts() {
  postsContainer.innerHTML = "";
}

function renderPost(title, body) {
  const article = document.createElement("article");
  article.className = "post";

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const p = document.createElement("p");
  p.textContent = body;

  article.appendChild(h3);
  article.appendChild(p);
  postsContainer.appendChild(article);
}

// ===== GET: загрузка публикаций =====
async function loadPosts() {
  loadBtn.disabled = true;
  clearPosts();
  showMessage("Загрузка публикаций…");

  try {
    const response = await fetch(GET_URL);

    if (!response.ok) {
      throw new Error(`Ошибка сервера: HTTP ${response.status}`);
    }

    const posts = await response.json();

    for (const post of posts) {
      renderPost(post.title, post.body);
    }

    showMessage(`Загружено публикаций: ${posts.length}`, "success");
  } catch (error) {
    showMessage(`Не удалось загрузить: ${error.message}`, "error");
  } finally {
    loadBtn.disabled = false;
  }
}

// ===== POST: создание публикации =====
async function createPost(title, body) {
  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  formError.textContent = "";
  showMessage("Отправка публикации…");

  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId: 1 })
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: HTTP ${response.status}`);
    }

    const data = await response.json();

    // Вывод ответа
    const article = document.createElement("article");
    article.className = "post";
    const h3 = document.createElement("h3");
    h3.textContent = `Создано: ${data.title} (ID: ${data.id})`;
    const p = document.createElement("p");
    p.textContent = data.body;
    article.appendChild(h3);
    article.appendChild(p);
    postsContainer.prepend(article);

    showMessage(`Публикация создана. ID: ${data.id}`, "success");
    form.reset();
  } catch (error) {
    showMessage(`Не удалось создать публикацию: ${error.message}`, "error");
  } finally {
    submitBtn.disabled = false;
  }
}

// ===== Валидация формы =====
function validate(title, body) {
  if (!title.trim()) return "Введите заголовок.";
  if (!body.trim()) return "Введите текст публикации.";
  return null;
}

// ===== Обработчики событий =====
loadBtn.addEventListener("click", loadPosts);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value;
  const body = bodyInput.value;

  const error = validate(title, body);
  if (error) {
    formError.textContent = error;
    return;
  }

  formError.textContent = "";
  createPost(title.trim(), body.trim());
});