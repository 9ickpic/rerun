// plugins/tailwind.js
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

module.exports.setup = async () => {
	console.log('⚙️ Инициализация TailwindCSS...');
	try {
		execSync('npx tailwindcss init -p', { stdio: 'inherit' });
		console.log('✅ Конфигурационные файлы TailwindCSS созданы');
	} catch (error) {
		throw new Error(`Ошибка при инициализации TailwindCSS: ${error.message}`);
	}

	// Обновление tailwind.config.js
	const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
	try {
		await fs.writeFile('tailwind.config.js', tailwindConfig);
		console.log('📝 Файл tailwind.config.js обновлен');
	} catch (error) {
		throw new Error(`Ошибка при обновлении tailwind.config.js: ${error.message}`);
	}

	// Обновление postcss.config.js для поддержки SCSS
	const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
	try {
		await fs.writeFile('postcss.config.js', postcssConfig);
		console.log('📝 Файл postcss.config.js обновлен');
	} catch (error) {
		throw new Error(`Ошибка при обновлении postcss.config.js: ${error.message}`);
	}

	// Создание директории src/, если она не существует
	try {
		await fs.ensureDir('src');
		console.log('📁 Директория src создана или уже существует');
	} catch (error) {
		throw new Error(`Ошибка при создании директории src: ${error.message}`);
	}

	// Создание src/index.scss с директивами Tailwind
	const scssContent = `@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
`;
	try {
		await fs.writeFile('src/index.scss', scssContent);
		console.log('📝 Файл src/index.scss создан с директивами Tailwind');
	} catch (error) {
		throw new Error(`Ошибка при создании src/index.scss: ${error.message}`);
	}
};
