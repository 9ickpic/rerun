#!/usr/bin/env node

const inquirer = require('inquirer');
const { searchPackages } = require('./lib/searchPackages');
const { installPackages, setupPackage } = require('./lib/install');
const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const { program } = require('commander');

const templateFrontendDir = path.join(__dirname, 'template', 'frontend');

// Common functions for Python backends
async function createPythonEnv(backendDir) {
	console.log(chalk.cyan('🌍 Создание виртуального окружения...'));
	try {
		await execa('python', ['-m', 'venv', 'venv'], { cwd: backendDir, stdio: 'inherit' });
		console.log(chalk.green('✅ Виртуальное окружение создано'));
	} catch (err) {
		console.error(chalk.red(`❌ Ошибка создания виртуального окружения: ${err.message}`));
		process.exit(1);
	}
}

async function installPythonDependencies(backendDir, requirements) {
	const pipCommand = process.platform === 'win32' ? path.join('venv', 'Scripts', 'pip') : path.join('venv', 'bin', 'pip');
	console.log(chalk.cyan('📦 Установка Python-зависимостей...'));
	try {
		await execa(pipCommand, ['install', ...requirements], { cwd: backendDir, stdio: 'inherit' });
		console.log(chalk.green('✅ Зависимости успешно установлены'));
	} catch (err) {
		console.error(chalk.red(`❌ Ошибка установки Python-зависимостей: ${err.message}`));
		process.exit(1);
	}
}

// Commands
async function add() {
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
}

async function init(cwd = process.cwd()) {
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
		await installPackages(packagesWithVersions, cwd);
		console.log(chalk.green('✅ Все пакеты успешно установлены'));
		for (const pkg of selectedPackages) {
			await setupPackage(pkg, cwd);
			console.log(chalk.green(`⚙️ Пакет ${pkg} успешно настроен`));
		}
		console.log(chalk.blue.bold('🎉 Инициализация проекта завершена успешно'));
		console.log(chalk.cyan('ℹ️ Проверьте package.json на наличие конфликтов версий и при необходимости добавьте "resolutions" или "overrides".'));
	} catch (error) {
		console.error(chalk.red(`❌ Ошибка при инициализации проекта: ${error.message}`));
		process.exit(1);
	}
}

async function list() {
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
}

async function clean(cwd = process.cwd()) {
	console.log(chalk.blue.bold('🧹 Очистка шаблона Create React App...'));
	const filesToRemove = ['src/App.js', 'src/index.js', 'src/App.css', 'src/index.css', 'src/logo.svg', 'public/favicon.ico', 'public/logo192.png', 'public/logo512.png'];

	try {
		for (const file of filesToRemove) {
			try {
				await fs.remove(path.join(cwd, file));
				console.log(chalk.green(`🗑️ Удален файл: ${file}`));
			} catch (err) {
				console.log(chalk.yellow(`⚠️ Не удалось удалить файл ${file}: ${err.message}`));
			}
		}

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

		await fs.writeFile(path.join(cwd, 'src/App.jsx'), appJsContent);
		console.log(chalk.green('📝 Обновлен файл App.jsx'));
		await fs.writeFile(path.join(cwd, 'src/index.jsx'), indexJsContent);
		console.log(chalk.green('📝 Обновлен файл index.jsx'));
		await fs.writeFile(path.join(cwd, 'src/App.scss'), `/* Стили для компонента App */\n`);
		console.log(chalk.green('📝 Создан файл App.scss'));

		console.log(chalk.blue.bold('🎉 Шаблон Create React App успешно очищен'));
	} catch (error) {
		console.error(chalk.red(`❌ Ошибка при очистке шаблона: ${error.message}`));
		process.exit(1);
	}
}

async function generate() {
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

		const semanticTags = {
			Header: 'header',
			Section: 'section',
			Article: 'article',
			Nav: 'nav',
			Main: 'main',
			Footer: 'footer',
			Aside: 'aside',
		};

		const normalizedName = componentName.charAt(0).toUpperCase() + componentName.slice(1).toLowerCase();
		const semanticTag = semanticTags[normalizedName] || 'div';
		const tag = useFramerMotion ? 'motion.div' : semanticTag;

		const jsxContent = `${useFramerMotion ? 'import { motion } from "framer-motion";\n' : ''}import React from 'react';
import styles from './${componentName}.module.scss';

function ${componentName}() {
  return (
    ${useFramerMotion ? `<motion.div className={styles.container}></motion.div>` : `<${semanticTag} className={styles.container}></${semanticTag}>`}
  );
}

export default ${componentName};
`;

		const scssContent = `/* Модульные стили для компонента ${componentName} */\n.container {}`;

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
		if (await fs.pathExists(jsxPath)) {
			const { overwrite } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'overwrite',
					message: `Файл ${jsxPath} уже существует. Перезаписать?`,
					default: false,
				},
			]);
			if (!overwrite) {
				console.log(chalk.yellow('⚠️ Пропуск создания файла.'));
				return;
			}
		}
		await fs.writeFile(jsxPath, jsxContent);
		console.log(chalk.green(`📝 Компонент ${componentName}.jsx создан по пути ${jsxPath}`));

		const scssPath = path.join(componentDir, `${componentName}.module.scss`);
		if (await fs.pathExists(scssPath)) {
			const { overwrite } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'overwrite',
					message: `Файл ${scssPath} уже существует. Перезаписать?`,
					default: false,
				},
			]);
			if (!overwrite) {
				console.log(chalk.yellow('⚠️ Пропуск создания файла.'));
				return;
			}
		}
		await fs.writeFile(scssPath, scssContent);
		console.log(chalk.green(`📝 Файл ${componentName}.module.scss создан по пути ${scssPath}`));

		const testPath = path.join(componentDir, `${componentName}.test.js`);
		if (await fs.pathExists(testPath)) {
			const { overwrite } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'overwrite',
					message: `Файл ${testPath} уже существует. Перезаписать?`,
					default: false,
				},
			]);
			if (!overwrite) {
				console.log(chalk.yellow('⚠️ Пропуск создания файла.'));
				return;
			}
		}
		await fs.writeFile(testPath, testContent);
		console.log(chalk.green(`📝 Файл ${componentName}.test.js создан по пути ${testPath}`));

		console.log(chalk.blue.bold('🎉 Генерация компонента завершена'));
	} catch (error) {
		console.error(chalk.red(`❌ Ошибка при генерации компонента: ${error.message}`));
		process.exit(1);
	}
}

async function create() {
	console.log(chalk.blue.bold('🏗️ Создание нового React-проекта...'));
	try {
		const files = await fs.readdir(process.cwd());
		if (files.length > 0 && !files.every(file => ['.git', '.gitignore'].includes(file))) {
			console.error(chalk.red('❌ Текущая директория не пуста. Пожалуйста, используйте пустую директорию или удалите ненужные файлы.'));
			process.exit(1);
		}

		console.log(chalk.cyan('⚙️ Выполняется npx create-react-app...'));
		await execa('npx', ['create-react-app', '.'], { stdio: 'inherit' });

		await clean();
		await init();

		console.log(chalk.blue.bold('🎉 Новый React-проект успешно создан и настроен'));
	} catch (error) {
		console.error(chalk.red(`❌ Ошибка при создании проекта: ${error.message}`));
		process.exit(1);
	}
}

async function createProject() {
	console.log(chalk.blue.bold('🏗️ Создание проекта с reRun CLI...'));

	const projectDir = process.cwd();
	const backendDir = path.join(projectDir, 'backend');
	const frontendDir = path.join(projectDir, 'frontend');

	const { projectType } = await inquirer.prompt([
		{
			type: 'list',
			name: 'projectType',
			message: chalk.cyan('Выберите тип проекта:'),
			choices: ['Monorepositories', 'Backend', 'Frontend'],
		},
	]);

	if (projectType === 'Monorepositories') {
		await createMonorepo(backendDir, frontendDir);
	} else if (projectType === 'Backend') {
		await createBackend(backendDir);
	} else {
		await createFrontend(frontendDir);
	}

	console.log(chalk.blue.bold('🎉 Проект успешно создан и настроен!'));
}

async function rerunCreate(component) {
	console.log(chalk.blue.bold('🏗️ Добавление компонента проекта с reRun CLI...'));

	const projectDir = process.cwd();
	const backendDir = path.join(projectDir, 'backend');
	const frontendDir = path.join(projectDir, 'frontend');

	let selectedComponent = component;
	if (!selectedComponent) {
		const { component } = await inquirer.prompt([
			{
				type: 'list',
				name: 'component',
				message: chalk.cyan('Что добавить?'),
				choices: ['Backend', 'Frontend'],
			},
		]);
		selectedComponent = component;
	}

	if (selectedComponent === 'Backend') {
		await createBackend(backendDir);
	} else {
		await createFrontend(frontendDir);
	}

	console.log(chalk.blue.bold('🎉 Компонент успешно добавлен!'));
}

// Helper functions
async function createMonorepo(backendDir, frontendDir) {
	console.log(chalk.cyan('⚙️ Создание monorepo...'));
	await createBackend(backendDir);
	await createFrontend(frontendDir);
}

async function createBackend(backendDir) {
	if (await fs.pathExists(backendDir)) {
		console.log(chalk.yellow('⚠️ Папка backend уже существует. Пропускаем...'));
		return;
	}

	const { backendTech } = await inquirer.prompt([
		{
			type: 'list',
			name: 'backendTech',
			message: chalk.cyan('Выберите технологию для бэкенда:'),
			choices: ['Node.js (Express)', 'Node.js (NestJS)', 'Python (FastAPI)', 'Python (Django)'],
		},
	]);

	await fs.ensureDir(backendDir);
	console.log(chalk.green(`📁 Создана директория ${backendDir}`));

	if (backendTech === 'Node.js (Express)') {
		await setupExpressBackend(backendDir);
	} else if (backendTech === 'Node.js (NestJS)') {
		await setupNestJsBackend(backendDir);
	} else if (backendTech === 'Python (FastAPI)') {
		await setupFastApiBackend(backendDir);
	} else {
		await setupDjangoBackend(backendDir);
	}
}

async function createFrontend(frontendDir) {
	if (await fs.pathExists(frontendDir)) {
		console.log(chalk.yellow('⚠️ Папка frontend уже существует. Пропускаем...'));
		return;
	}

	console.log(chalk.cyan('⚙️ Создание фронтенда...'));
	await fs.ensureDir(frontendDir);
	console.log(chalk.green(`📁 Создана директория ${frontendDir}`));

	console.log(chalk.cyan('⚙️ Выполняется npx create-react-app...'));
	try {
		await execa('npx', ['create-react-app', '.'], { cwd: frontendDir, stdio: 'inherit' });
	} catch (err) {
		console.error(chalk.red(`❌ Ошибка создания React-проекта: ${err.message}`));
		process.exit(1);
	}

	await clean(frontendDir);
	await init(frontendDir);

	console.log(chalk.cyan('📦 Установка фронтенд-зависимостей...'));
	try {
		await execa('npm', ['install'], { cwd: frontendDir, stdio: 'inherit' });
		console.log(chalk.green('✅ Зависимости успешно установлены'));
	} catch (err) {
		console.error(chalk.red(`❌ Ошибка установки зависимостей: ${err.message}`));
		process.exit(1);
	}
}

async function setupExpressBackend(backendDir) {
	console.log(chalk.cyan('⚙️ Настройка Node.js бэкенда (Express)...'));

	const packageJson = {
		name: 'backend',
		version: '1.0.0',
		type: 'module',
		main: 'index.js',
		scripts: {
			start: 'node index.js',
			dev: 'nodemon index.js',
		},
		dependencies: {
			express: '^4.18.2',
			cors: '^2.8.5',
		},
		devDependencies: {
			nodemon: '^3.0.1',
		},
	};
	await fs.writeJson(path.join(backendDir, 'package.json'), packageJson, { spaces: 2 });
	console.log(chalk.green('📝 Создан package.json'));

	const indexJs = `
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

app.listen(port, () => {
  console.log(\`Backend running on http://localhost:\${port}\`);
});
`;
	await fs.writeFile(path.join(backendDir, 'index.js'), indexJs);
	console.log(chalk.green('📝 Создан index.js'));

	console.log(chalk.cyan('📦 Установка Node.js зависимостей...'));
	try {
		await execa('npm', ['install'], { cwd: backendDir, stdio: 'inherit' });
		console.log(chalk.green('✅ Зависимости успешно установлены'));
	} catch (err) {
		console.error(chalk.red(`❌ Ошибка установки зависимостей: ${err.message}`));
		process.exit(1);
	}
}

async function setupNestJsBackend(backendDir) {
	console.log(chalk.cyan('⚙️ Настройка Node.js бэкенда (NestJS)...'));

	console.log(chalk.cyan('⚙️ Создание NestJS проекта...'));
	try {
		await execa('npx', ['@nestjs/cli', 'new', '.', '-p', 'npm', '--skip-git'], { cwd: backendDir, stdio: 'inherit' });
		console.log(chalk.green('✅ NestJS проект создан'));
	} catch (err) {
		console.error(chalk.red(`❌ Ошибка создания NestJS проекта: ${err.message}`));
		process.exit(1);
	}

	const packageJsonPath = path.join(backendDir, 'package.json');
	const packageJson = await fs.readJson(packageJsonPath);
	packageJson.type = 'module';
	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	console.log(chalk.green('📝 Обновлен package.json для ES Modules'));

	console.log(chalk.cyan('📦 Установка дополнительных зависимостей...'));
	try {
		await execa('npm', ['install', 'cors'], { cwd: backendDir, stdio: 'inherit' });
		console.log(chalk.green('✅ Зависимости успешно установлены'));
	} catch (err) {
		console.error(chalk.red(`❌ Ошибка установки зависимостей: ${err.message}`));
		process.exit(1);
	}

	const mainTs = `
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use('/test', (req, res) => res.json({ message: 'Hello from NestJS backend!' }));
  await app.listen(3001);
}
bootstrap();
`;
	await fs.writeFile(path.join(backendDir, 'src/main.ts'), mainTs);
	console.log(chalk.green('📝 Обновлен main.ts'));
}

async function setupFastApiBackend(backendDir) {
	console.log(chalk.cyan('⚙️ Настройка Python бэкенда (FastAPI)...'));

	await createPythonEnv(backendDir);

	const mainPy = `
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI backend!"}
`;
	await fs.writeFile(path.join(backendDir, 'main.py'), mainPy);
	console.log(chalk.green('📝 Создан main.py'));

	const requirementsTxt = `
fastapi==0.104.1
uvicorn==0.24.0
`;
	await fs.writeFile(path.join(backendDir, 'requirements.txt'), requirementsTxt);
	console.log(chalk.green('📝 Создан requirements.txt'));

	await installPythonDependencies(backendDir, ['-r', 'requirements.txt']);

	console.log(chalk.cyan('⚙️ Настройка скрипта запуска...'));
	const { os } = await inquirer.prompt([
		{
			type: 'list',
			name: 'os',
			message: chalk.cyan('Выберите операционную систему:'),
			choices: ['Linux', 'Windows'],
		},
	]);

	const runScript = os === 'Windows' ? 'run.bat' : 'run.sh';
	const runScriptPath = path.join(backendDir, runScript);
	let runContent;

	if (os === 'Linux') {
		runContent = `#!/bin/bash
source ${path.join('venv', 'bin', 'activate')}
echo "Виртуальное окружение активировано"
${path.join('venv', 'bin', 'uvicorn')} main:app --reload
`;
	} else {
		runContent = `@echo off
call ${path.join('venv', 'Scripts', 'activate')}
echo Виртуальное окружение активировано
${path.join('venv', 'Scripts', 'uvicorn')} main:app --reload
`;
	}

	await fs.writeFile(runScriptPath, runContent);
	console.log(chalk.green(`📝 Создан ${runScript}`));

	if (os === 'Linux') {
		console.log(chalk.cyan('🔐 Установка прав на выполнение...'));
		try {
			await execa('chmod', ['+x', runScriptPath], { cwd: backendDir, stdio: 'inherit' });
			console.log(chalk.green('✅ Права на выполнение установлены'));
		} catch (error) {
			console.log(chalk.yellow('⚠️ Ошибка установки прав, пытаемся с sudo...'));
			try {
				await execa('sudo', ['chmod', '+x', runScriptPath], { cwd: backendDir, stdio: 'inherit' });
				console.log(chalk.green('✅ Права на выполнение установлены с sudo'));
			} catch (sudoError) {
				console.error(chalk.red(`❌ Ошибка установки прав: ${sudoError.message}`));
				process.exit(1);
			}
		}
	}
}

async function setupDjangoBackend(backendDir) {
	console.log(chalk.cyan('⚙️ Настройка Python бэкенда (Django)...'));

	await createPythonEnv(backendDir);

	const pipCommand = process.platform === 'win32' ? path.join('venv', 'Scripts', 'pip') : path.join('venv', 'bin', 'pip');
	console.log(chalk.cyan('📦 Установка Django...'));
	try {
		await execa(pipCommand, ['install', 'django==4.2.7', 'djangorestframework==3.14.0'], { cwd: backendDir, stdio: 'inherit' });
		console.log(chalk.green('✅ Django и зависимости установлены'));
	} catch (err) {
		console.error(chalk.red(`❌ Ошибка установки Django: ${err.message}`));
		process.exit(1);
	}

	console.log(chalk.cyan('⚙️ Создание Django проекта...'));
	const djangoAdmin = process.platform === 'win32' ? path.join('venv', 'Scripts', 'django-admin') : path.join('venv', 'bin', 'django-admin');
	try {
		await execa(djangoAdmin, ['startproject', 'backend', '.'], { cwd: backendDir, stdio: 'inherit' });
		console.log(chalk.green('✅ Django проект создан'));
	} catch (err) {
		console.error(chalk.red(`❌ Ошибка создания Django проекта: ${err.message}`));
		process.exit(1);
	}

	const settingsPath = path.join(backendDir, 'backend', 'settings.py');
	let settingsContent = await fs.readFile(settingsPath, 'utf-8');
	settingsContent = settingsContent.replace(
		'INSTALLED_APPS = [',
		`INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',`,
	);
	settingsContent = settingsContent.replace(
		'MIDDLEWARE = [',
		`MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',`,
	);
	settingsContent += `
CORS_ALLOW_ALL_ORIGINS = True
`;
	await fs.writeFile(settingsPath, settingsContent);
	console.log(chalk.green('📝 Обновлен settings.py'));

	const urlsPy = `
from django.urls import path
from rest_framework.response import Response
from rest_framework.views import APIView

class HelloView(APIView):
    def get(self, request):
        return Response({"message": "Hello from Django backend!"})

urlpatterns = [
    path('', HelloView.as_view(), name='hello'),
]
`;
	await fs.writeFile(path.join(backendDir, 'backend', 'urls.py'), urlsPy);
	console.log(chalk.green('📝 Создан urls.py'));

	const requirementsTxt = `
django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
`;
	await fs.writeFile(path.join(backendDir, 'requirements.txt'), requirementsTxt);
	console.log(chalk.green('📝 Создан requirements.txt'));

	await installPythonDependencies(backendDir, ['-r', 'requirements.txt']);

	console.log(chalk.cyan('⚙️ Настройка скрипта запуска...'));
	const { os } = await inquirer.prompt([
		{
			type: 'list',
			name: 'os',
			message: chalk.cyan('Выберите операционную систему:'),
			choices: ['Linux', 'Windows'],
		},
	]);

	const runScript = os === 'Windows' ? 'run.bat' : 'run.sh';
	const runScriptPath = path.join(backendDir, runScript);
	let runContent;

	if (os === 'Linux') {
		runContent = `#!/bin/bash
source ${path.join('venv', 'bin', 'activate')}
echo "Виртуальное окружение активировано"
${path.join('venv', 'bin', 'python')} manage.py runserver
`;
	} else {
		runContent = `@echo off
call ${path.join('venv', 'Scripts', 'activate')}
echo Виртуальное окружение активировано
${path.join('venv', 'Scripts', 'python')} manage.py runserver
`;
	}

	await fs.writeFile(runScriptPath, runContent);
	console.log(chalk.green(`📝 Создан ${runScript}`));

	if (os === 'Linux') {
		console.log(chalk.cyan('🔐 Установка прав на выполнение...'));
		try {
			await execa('chmod', ['+x', runScriptPath], { cwd: backendDir, stdio: 'inherit' });
			console.log(chalk.green('✅ Права на выполнение установлены'));
		} catch (error) {
			console.log(chalk.yellow('⚠️ Ошибка установки прав, пытаемся с sudo...'));
			try {
				await execa('sudo', ['chmod', '+x', runScriptPath], { cwd: backendDir, stdio: 'inherit' });
				console.log(chalk.green('✅ Права на выполнение установлены с sudo'));
			} catch (sudoError) {
				console.error(chalk.red(`❌ Ошибка установки прав: ${sudoError.message}`));
				process.exit(1);
			}
		}
	}
}

// CLI Setup
async function main() {
	console.clear();
	console.log(chalk.blue.bold('⚡️ Добро пожаловать в reRun CLI!'));

	program.version('1.0.0').description('reRun CLI for managing React projects and backends');

	program.command('add').description('Add a package to the project').action(add);

	program.command('init').description('Initialize a project with selected packages').action(init);

	program.command('list').description('List installed packages').action(list);

	program.command('clean').description('Clean Create React App template').action(clean);

	program.command('generate').description('Generate a new React component').action(generate);

	program.command('create').description('Create a new React project').argument('[component]', 'Component to add (Backend or Frontend)', null).action(rerunCreate);

	program.command('create-project').description('Create a new project (monorepo, backend, or frontend)').action(createProject);

	program.parse(process.argv);

	// Default to init if no command is provided
	if (!process.argv.slice(2).length) {
		await init();
	}
}

main().catch(err => {
	console.error(chalk.red(`❌ Критическая ошибка: ${err.message}`));
	process.exit(1);
});
