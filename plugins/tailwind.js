const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

module.exports.setup = async frontendDir => {
	console.log(chalk.cyan('⚙️ Инициализация TailwindCSS...'));

	// Проверяем наличие файлов, созданных в init
	const tailwindConfigPath = path.join(frontendDir, 'tailwind.config.js');
	const postcssConfigPath = path.join(frontendDir, 'postcss.config.js');
	const indexScssPath = path.join(frontendDir, 'src', 'index.scss');

	if ((await fs.pathExists(tailwindConfigPath)) && (await fs.pathExists(postcssConfigPath)) && (await fs.pathExists(indexScssPath))) {
		console.log(chalk.cyan('ℹ️ Конфигурационные файлы TailwindCSS уже созданы в init'));
		return;
	}

	// Если файлы отсутствуют (маловероятно, так как init их создаёт), создаём их
	const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
	await fs.writeFile(tailwindConfigPath, tailwindConfig);
	console.log(chalk.green('📝 Создан tailwind.config.js'));

	const postcssConfig = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
	await fs.writeFile(postcssConfigPath, postcssConfig);
	console.log(chalk.green('📝 Создан postcss.config.js'));

	await fs.ensureDir(path.join(frontendDir, 'src'));
	const indexScss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;
	await fs.writeFile(indexScssPath, indexScss);
	console.log(chalk.green('📝 Создан src/index.scss с директивами Tailwind'));

	console.log(chalk.green('✅ Конфигурационные файлы TailwindCSS созданы'));
};
