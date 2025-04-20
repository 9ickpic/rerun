# reRun CLI

![reRun CLI Banner](reRun-package.png)

**reRun** — это легкий и интуитивный инструмент командной строки (CLI) для упрощения создания и управления React-проектами и компонентами. С помощью `reRun` вы можете быстро создать новый React-проект или сгенерировать компоненты с чистой, семантической структурой, включая файлы JSX, модульные SCSS-стили и тесты.

## Возможности

- **Создание проекта**: Инициализация нового React-проекта с помощью одной команды, с предустановленной поддержкой `create-react-app` и SCSS.
- **Генерация компонентов**: Создание React-компонентов со следующей структурой:
  - `*.jsx` — логика компонента.
  - `*.module.scss` — модульные стили.
  - `*.test.js` — тесты для Jest.
  - **Семантические теги**: Если компонент назван `Header`, `Section`, `Article`, `Nav`, `Main`, `Footer` или `Aside`, используется соответствующий HTML-тег (например, `<header>`). При использовании Framer Motion — `<motion.div>`.
  - Опциональная поддержка анимаций с Framer Motion.
- **Очистка проекта**: Сброс директории `src/` до чистого состояния с файлами `App.jsx`, `index.jsx`, `App.scss` и `index.scss`.
- **Красивый вывод в консоль**: Цветной и читаемый вывод в терминале с использованием библиотеки `chalk`.
- **Расширяемость**: Легко адаптируется для поддержки TypeScript, новых шаблонов или дополнительных функций.

## Установка

### Требования

- [Node.js](https://nodejs.org/) (версия 16 или выше)
- [npm](https://www.npmjs.com/) или [yarn](https://yarnpkg.com/)

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

- **`create`**: Создание нового React-проекта.

  ```bash
  rerun create
  ```

  !!Создает проект в рабочей директории терминала!!
  Создает новый React-проект с использованием `create-react-app`, настраивает SCSS и файлы `App.jsx`, `index.jsx`.

- **`generate`**: Генерация нового React-компонента.

  ```bash
  rerun generate
  ```

  Запрашивает:

  - Имя компонента (в формате PascalCase, например, `Header`, `Modal`).
  - Использовать ли Framer Motion для анимаций.

  Создает файлы:

  - `src/components/ComponentName/ComponentName.jsx`
  - `src/components/ComponentName/ComponentName.module.scss`
  - `src/components/ComponentName/ComponentName.test.js`

  **Семантические теги**: Если имя компонента — `Header`, `Section`, `Article`, `Nav`, `Main`, `Footer` или `Aside`, используется соответствующий HTML-тег (например, `<header>`). С Framer Motion применяется `<motion.div>`.

- **`clean`**: Очистка директории `src/` до начального состояния.
  ```bash
  rerun clean
  ```
  Удаляет содержимое `src/` и создает стандартные файлы `App.jsx`, `index.jsx`, `App.scss`, `index.scss`.

### Пример

Чтобы сгенерировать компонент `Header`:

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

Созданный `Header.jsx` будет содержать семантический тег `<header>`:

```jsx
import React from 'react';
import styles from './Header.module.scss';

function Header() {
	return <header className={styles.container}></header>;
}

export default Header;
```

## Вклад в проект

Чтобы внести свой вклад:

1. Сделайте форк репозитория.
2. Создайте новую ветку (`git checkout -b feature/your-feature`).
3. Внесите изменения.
4. Зафиксируйте изменения (`git commit -m "Добавлена новая функция"`).
5. Отправьте ветку в репозиторий (`git push origin feature/your-feature`).
6. Откройте Pull Request.

## Лицензия

Проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

## Проблемы и предложения

Обнаружили ошибку или хотите предложить новую функцию? Пожалуйста, создайте issue на [странице GitHub Issues](https://github.com/9ickpic/rerun/issues).

## Контакты

По вопросам или отзывам свяжитесь с [Ярославом](mailto:moontesearch@gmail.com) или создайте issue на GitHub.

---

Создано с ❤️ [9ickpic](https://github.com/9ickpic)
