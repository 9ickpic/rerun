# reRun CLI

![reRun CLI Banner](reRun-package.png)

**reRun** — мощный и интуитивный инструмент командной строки (CLI) для упрощения создания, настройки и управления React-проектами, а также проектами с бэкендом. С `reRun` вы можете быстро создавать React-приложения, генерировать компоненты с семантической структурой, настраивать бэкенд на Node.js (Express, NestJS) или Python (FastAPI, Django) и управлять зависимостями.

## Возможности

- **Создание React-проекта**: Инициализация нового React-проекта с использованием `create-react-app`, настройка SCSS и чистой структуры (`App.jsx`, `index.jsx`).
- **Создание проектов с бэкендом**: Поддержка создания монолитных репозиториев, бэкенд-приложений (Express, NestJS, FastAPI, Django) или фронтенд-приложений.
- **Генерация компонентов**: Создание React-компонентов с файлами:
  - `*.jsx` — логика компонента.
  - `*.module.scss` — модульные стили.
  - `*.test.js` — тесты для Jest.
  - **Семантические теги**: Использование HTML-тегов (`<header>`, `<section>`, `<article>`, `<nav>`, `<main>`, `<footer>`, `<aside>`) для компонентов с соответствующими именами (например, `Header`, `Section`). При использовании Framer Motion — `<motion.div>`.
  - Опциональная поддержка анимаций с Framer Motion.
- **Очистка проекта**: Удаление стандартных файлов `create-react-app` и создание чистой структуры с `App.jsx`, `index.jsx`, `App.scss`, `index.scss`.
- **Управление зависимостями**: Интерактивная установка пакетов (например, `tailwindcss`, `eslint`, `framer-motion`) с автоматической настройкой.
- **Список зависимостей**: Просмотр установленных пакетов в проекте.
- **Красивый вывод**: Цветной и информативный вывод в консоли с использованием `chalk`.
- **Безопасность**: Проверка существующих файлов перед перезаписью при генерации компонентов.
- **Расширяемость**: Легкая адаптация для поддержки TypeScript, новых шаблонов или дополнительных технологий.

## Установка

### Требования

- [Node.js](https://nodejs.org/) (версия 16 или выше)
- [npm](https://www.npmjs.com/) или [yarn](https://yarnpkg.com/)
- [Python](https://www.python.org/) (версия 3.8 или выше, для бэкендов FastAPI/Django)

### Установка через npm

```bash
npm install -g @9ickpic/rerun
```

### Установка напрямую с GitHub

```bash
npm install -g 9ickpic/rerun
```

## Использование

Для просмотра доступных команд выполните:

```bash
rerun --help
```

### Команды

- **`create`**: Создание нового React-проекта или добавление компонента (бэкенд/фронтенд).

  ```bash
  rerun create
  rerun create backend
  rerun create frontend
  ```

  Создает React-проект с использованием `create-react-app` в текущей директории (должна быть пустой). При указании `backend` или `frontend` добавляет соответствующий компонент в существующий проект. Настраивает SCSS и базовые файлы (`App.jsx`, `index.jsx`).

- **`create-project`**: Создание нового проекта с выбором типа (монолитный репозиторий, бэкенд или фронтенд).

  ```bash
  rerun create-project
  ```

  Запрашивает тип проекта:

  - **Monorepositories**: Создает проект с бэкендом и фронтендом.
  - **Backend**: Создает бэкенд на Express, NestJS, FastAPI или Django.
  - **Frontend**: Создает React-приложение.

- **`generate`**: Генерация нового React-компонента.

  ```bash
  rerun generate
  ```

  Запрашивает:

  - Имя компонента (в формате PascalCase, например, `Header`, `Modal`).
  - Использовать ли Framer Motion для анимаций.

  Создает файлы в `src/components/ComponentName/`:

  - `ComponentName.jsx`
  - `ComponentName.module.scss`
  - `ComponentName.test.js`

  Если файлы уже существуют, запрашивает подтверждение перезаписи.

- **`clean`**: Очистка директории `src/` до начального состояния.

  ```bash
  rerun clean
  ```

  Удаляет стандартные файлы `create-react-app` и создает `App.jsx`, `index.jsx`, `App.scss`, `index.scss`.

- **`add`**: Интерактивная установка пакета.

  ```bash
  rerun add
  ```

  Позволяет искать и устанавливать пакеты (например, `tailwindcss`, `eslint`) с автоматической настройкой.

- **`init`**: Инициализация проекта с выбором зависимостей.

  ```bash
  rerun init
  ```

  Предлагает выбрать пакеты из категорий (иконки, утилиты, анимации, линтеры, дополнительные) и устанавливает их с настройкой.

- **`list`**: Просмотр установленных зависимостей.

  ```bash
  rerun list
  ```

  Выводит список зависимостей из `package.json`.

### Пример

#### Генерация компонента `Header`:

```bash
rerun generate
```

```
? Введите название компонента (PascalCase): Header
? Использовать Framer Motion для анимаций? Нет
📍 Текущая рабочая директория: /path/to/your-project
📁 Директория src создана или уже существует
📁 Директория src/components/Header создана или уже существует
📝 Компонент Header.jsx создан по пути src/components/Header/Header.jsx
📝 Файл Header.module.scss создан по пути src/components/Header/Header.module.scss
📝 Файл Header.test.js создан по пути src/components/Header/Header.test.js
🎉 Генерация компонента завершена
```

Созданный `Header.jsx`:

```jsx
import React from 'react';
import styles from './Header.module.scss';

function Header() {
	return <header className={styles.container}></header>;
}

export default Header;
```

#### Создание проекта с бэкендом и фронтендом:

```bash
rerun create-project
```

```
? Выберите тип проекта: Monorepositories
? Выберите технологию для бэкенда: Node.js (Express)
⚙️ Создание monorepo...
📁 Создана директория backend
⚙️ Настройка Node.js бэкенда (Express)...
📝 Создан package.json
📝 Создан index.js
📦 Установка Node.js зависимостей...
✅ Зависимости успешно установлены
⚙️ Создание фронтенда...
📁 Создана директория frontend
⚙️ Выполняется npx create-react-app...
🧹 Очистка шаблона Create React App...
📝 Обновлен файл App.jsx
📝 Обновлен файл index.jsx
📝 Создан файл App.scss
🎉 Шаблон Create React App успешно очищен
🚀 Запуск инициализации проекта...
📋 Выберите пакеты для установки:
...
🎉 Проект успешно создан и настроен!
```

## Вклад в проект

Чтобы внести свой вклад:

1. Сделайте форк репозитория ([https://github.com/9ickpic/rerun](https://github.com/9ickpic/rerun)).
2. Создайте новую ветку (`git checkout -b feature/your-feature`).
3. Внесите изменения.
4. Зафиксируйте изменения (`git commit -m "Добавлена новая функция"`).
5. Отправьте ветку в репозиторий (`git push origin feature/your-feature`).
6. Откройте Pull Request.

## Лицензия

Проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

## Проблемы и предложения

Обнаружили ошибку или хотите предложить новую функцию? Создайте issue на [странице GitHub Issues](https://github.com/9ickpic/rerun/issues).

## Контакты

По вопросам или отзывам свяжитесь с [Ярославом](mailto:moontesearch@gmail.com) или создайте issue на GitHub.

---

Создано с ❤️ [9ickpic](https://github.com/9ickpic)
