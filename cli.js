#!/usr/bin/env node
const inquirer = require('inquirer');
const { searchPackages } = require('./lib/searchPackages');
const { installPackages, setupPackage } = require('./lib/install');
const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const chalk = require('chalk');

const commands = {
	async add() {
		console.log(chalk.blue.bold('🔍 Запуск поиска пакетов...'));
		const { packageName } = await inquirer.prompt([
			{
				type: 'autocomplete',
				name: 'packageName',
				message: 'Какой пакет установить?',
				source: async (_, input) => searchPackages(input),
			},
		]);

		try {
			const packageWithVersion = packageName === 'eslint-plugin-tailwindcss' ? 'eslint-plugin-tailwindcss@3.17.0' : packageName;
			await installPackages([packageWithVersion]);
			console.log(chalk.green(`✅ Пакет ${packageName} успешно установлен`));
			await setupPackage(packageName);
			console.log(chalk.green(`⚙️ Пакет ${packageName} успешно настроен`));
		} catch (error) {
			console.error(chalk.red(`❌ Ошибка при обработке пакета ${packageName}: ${error.message}`));
			process.exit(1);
		}
	},

	async init() {
		console.log(chalk.blue.bold('🚀 Запуск инициализации проекта...'));

		const packageGroups = [
			{
				name: 'Иконки',
				packages: [{ name: 'lucide-react', checked: false }],
			},
			{
				name: 'Утилиты',
				packages: [
					{ name: 'clsx', checked: true },
					{ name: 'lodash', checked: false },
					{ name: 'uuid', checked: false },
				],
			},
			{
				name: 'Анимации',
				packages: [{ name: 'framer-motion', checked: false }],
			},
			{
				name: 'Линтеры и форматтеры',
				packages: [
					{ name: 'eslint-plugin-tailwindcss', checked: true },
					{ name: 'prettier', checked: true },
					{ name: 'eslint-config-prettier', checked: true },
					{ name: 'eslint-plugin-react', checked: true },
					{ name: 'eslint-plugin-react-hooks', checked: true },
				],
			},
			{
				name: 'Дополнительно',
				packages: [
					{ name: 'why-did-you-render', checked: true },
					{ name: 'tailwindcss', checked: true },
					{ name: 'postcss', checked: true },
					{ name: 'autoprefixer', checked: true },
					{ name: 'sass', checked: true },
					{ name: '@headlessui/react', checked: false },
					{ name: 'zod', checked: false },
					{ name: 'react-loading-skeleton', checked: false },
					{ name: 'react-hot-toast', checked: false },
					{ name: 'react-hook-form', checked: false },
					{ name: 'axios', checked: false },
					{ name: 'zustand', checked: false },
					{ name: 'openai', checked: false },
					{ name: 'fuse.js', checked: false },
					{ name: 'msw', checked: false },
				],
			},
		];

		console.log(chalk.cyan('📋 Выберите пакеты для установки:'));
		const selectedPackages = [];

		for (const group of packageGroups) {
			const { packages } = await inquirer.prompt([
				{
					type: 'checkbox',
					name: 'packages',
					message: chalk.yellow(`📦 ${group.name}`),
					choices: group.packages,
				},
			]);
			selectedPackages.push(...packages);
		}

		if (!selectedPackages.length) {
			console.log(chalk.yellow('⚠️ Не выбрано ни одного пакета. Завершение инициализации.'));
			return;
		}

		console.log(chalk.cyan('\n📋 Выбранные пакеты:'));
		selectedPackages.forEach(pkg => console.log(chalk.green(`  ✓ ${pkg}`)));

		try {
			const packagesWithVersions = selectedPackages.map(pkg => {
				if (pkg === 'tailwindcss') return 'tailwindcss@3.4.0';
				if (pkg === 'eslint-plugin-tailwindcss') return 'eslint-plugin-tailwindcss@3.17.0';
				return pkg;
			});
			await installPackages(packagesWithVersions);
			console.log(chalk.green('✅ Все пакеты успешно установлены'));
			for (const pkg of selectedPackages) {
				await setupPackage(pkg);
				console.log(chalk.green(`⚙️ Пакет ${pkg} успешно настроен`));
			}
			console.log(chalk.blue.bold('🎉 Инициализация проекта завершена успешно'));
			console.log(chalk.cyan('ℹ️ Проверьте package.json на наличие конфликтов версий и при необходимости добавьте "resolutions" или "overrides".'));
		} catch (error) {
			console.error(chalk.red(`❌ Ошибка при инициализации проекта: ${error.message}`));
			process.exit(1);
		}
	},

	async list() {
		console.log(chalk.blue.bold('📦 Сканирование установленных пакетов...'));
		try {
			const packageJson = await fs.readJson('package.json');
			console.log(chalk.cyan('📋 Установленные пакеты:'));
			Object.keys(packageJson.dependencies || {}).forEach(pkg => {
				console.log(chalk.green(`  ✓ ${pkg}`));
			});
		} catch (error) {
			console.error(chalk.red(`❌ Ошибка при чтении package.json: ${error.message}`));
			process.exit(1);
		}
	},

	async clean() {
		console.log(chalk.blue.bold('🧹 Очистка шаблона Create React App...'));
		const filesToRemove = ['src/App.js', 'src/index.js', 'src/App.css', 'src/index.css', 'src/logo.svg', 'public/favicon.ico', 'public/logo192.png', 'public/logo512.png'];

		try {
			for (const file of filesToRemove) {
				await fs.remove(file).catch(() => {});
				console.log(chalk.green(`🗑️ Удален файл: ${file}`));
			}

			// Обновление App.jsx
			const appJsContent = `import React from 'react';
import './App.scss';

function App() {
  return (
    <div className="App">
      <h1>Добро пожаловать в ваше React-приложение</h1>
    </div>
  );
}

export default App;`;

			// Обновление index.jsx
			const indexJsContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

			await fs.writeFile('src/App.jsx', appJsContent);
			console.log(chalk.green('📝 Обновлен файл App.jsx'));
			await fs.writeFile('src/index.jsx', indexJsContent);
			console.log(chalk.green('📝 Обновлен файл index.jsx'));
			await fs.writeFile('src/App.scss', `/* Стили для компонента App */\n`);
			console.log(chalk.green('📝 Создан файл App.scss'));

			console.log(chalk.blue.bold('🎉 Шаблон Create React App успешно очищен'));
		} catch (error) {
			console.error(chalk.red(`❌ Ошибка при очистке шаблона: ${error.message}`));
			process.exit(1);
		}
	},

	async generate() {
		console.log(chalk.blue.bold('🛠️ Генерация компонента...'));
		try {
			const { componentName, useFramerMotion } = await inquirer.prompt([
				{
					type: 'input',
					name: 'componentName',
					message: 'Введите название компонента (PascalCase):',
					validate: input => /^[A-Z][a-zA-Z]*$/.test(input) || 'Название должно быть в PascalCase',
				},
				{
					type: 'confirm',
					name: 'useFramerMotion',
					message: 'Использовать Framer Motion для анимаций?',
					default: false,
				},
			]);

			console.log(chalk.cyan(`📍 Текущая рабочая директория: ${process.cwd()}`));

			await fs.ensureDir('src');
			console.log(chalk.green('📁 Директория src создана или уже существует'));

			const componentDir = path.join('src', 'components', componentName);
			await fs.ensureDir(componentDir);
			console.log(chalk.green(`📁 Директория ${componentDir} создана или уже существует`));

			// Маппинг семантических тегов
			const semanticTags = {
				Header: 'header',
				Section: 'section',
				Article: 'article',
				Nav: 'nav',
				Main: 'main',
				Footer: 'footer',
				Aside: 'aside',
			};

			// Определяем тег для компонента
			const normalizedName = componentName.charAt(0).toUpperCase() + componentName.slice(1).toLowerCase();
			const semanticTag = semanticTags[normalizedName] || 'div';
			const tag = useFramerMotion ? 'motion.div' : semanticTag;

			// Создание *ComponentName*.jsx
			const jsxContent = `${useFramerMotion ? 'import { motion } from "framer-motion";\n' : ''}import React from 'react';
	import styles from './${componentName}.module.scss';
	
	function ${componentName}() {
		return (
			${useFramerMotion ? `<motion.div className={styles.container}></motion.div>` : `<${semanticTag} className={styles.container}></${semanticTag}>`}
		);
	}
	
	export default ${componentName};
	`;

			// Создание *ComponentName*.module.scss
			const scssContent = `/* Модульные стили для компонента ${componentName} */\n.container {}`;

			// Создание *ComponentName*.test.js
			const testContent = `import React from 'react';
	import { render } from '@testing-library/react';
	import ${componentName} from './${componentName}';
	
	describe('${componentName}', () => {
		it('renders without crashing', () => {
			render(<${componentName} />);
		});
	});
	`;

			const jsxPath = path.join(componentDir, `${componentName}.jsx`);
			const scssPath = path.join(componentDir, `${componentName}.module.scss`);
			const testPath = path.join(componentDir, `${componentName}.test.js`);

			await fs.writeFile(jsxPath, jsxContent);
			if (await fs.pathExists(jsxPath)) {
				console.log(chalk.green(`📝 Компонент ${componentName}.jsx создан по пути ${jsxPath}`));
			} else {
				throw new Error(`Не удалось создать ${jsxPath}`);
			}

			await fs.writeFile(scssPath, scssContent);
			if (await fs.pathExists(scssPath)) {
				console.log(chalk.green(`📝 Файл ${componentName}.module.scss создан по пути ${scssPath}`));
			} else {
				throw new Error(`Не удалось создать ${scssPath}`);
			}

			await fs.writeFile(testPath, testContent);
			if (await fs.pathExists(testPath)) {
				console.log(chalk.green(`📝 Файл ${componentName}.test.js создан по пути ${testPath}`));
			} else {
				throw new Error(`Не удалось создать ${testPath}`);
			}

			console.log(chalk.blue.bold('🎉 Генерация компонента завершена'));
		} catch (error) {
			console.error(chalk.red(`❌ Ошибка при генерации компонента: ${error.message}`));
			process.exit(1);
		}
	},

	async create() {
		console.log(chalk.blue.bold('🏗️ Создание нового React-проекта...'));
		try {
			// Проверка, что директория пуста
			const files = await fs.readdir(process.cwd());
			if (files.length > 0 && !files.every(file => ['.git', '.gitignore'].includes(file))) {
				console.error(chalk.red('❌ Текущая директория не пуста. Пожалуйста, используйте пустую директорию или удалите ненужные файлы.'));
				process.exit(1);
			}

			// Запуск create-react-app
			console.log(chalk.cyan('⚙️ Выполняется npx create-react-app...'));
			await execa('npx', ['create-react-app', '.'], { stdio: 'inherit' });

			// Очистка шаблона
			await commands.clean();

			// Инициализация проекта
			await commands.init();

			console.log(chalk.blue.bold('🎉 Новый React-проект успешно создан и настроен'));
		} catch (error) {
			console.error(chalk.red(`❌ Ошибка при создании проекта: ${error.message}`));
			process.exit(1);
		}
	},
};

async function main() {
	console.clear();
	console.log(chalk.blue.bold('⚡️ Добро пожаловать в reRun CLI!'));
	const [, , command = 'init'] = process.argv;

	if (!commands[command]) {
		console.log(chalk.red(`❌ Неизвестная команда: ${command}`));
		console.log(chalk.cyan('ℹ️ Доступные команды: add, init, list, clean, generate, create'));
		process.exit(1);
	}

	await commands[command]();
}

main().catch(err => {
	console.error(chalk.red(`❌ Критическая ошибка: ${err.message}`));
	process.exit(1);
});
