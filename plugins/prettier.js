const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

module.exports.setup = async frontendDir => {
	console.log(chalk.cyan('⚙️ Настройка Prettier...'));

	// Проверяем наличие файлов, созданных в init
	const prettierConfigPath = path.join(frontendDir, '.prettierrc.json');
	const prettierIgnorePath = path.join(frontendDir, '.prettierignore');

	if ((await fs.pathExists(prettierConfigPath)) && (await fs.pathExists(prettierIgnorePath))) {
		console.log(chalk.cyan('ℹ️ Конфигурационные файлы Prettier уже созданы в init'));
		return;
	}

	// Если файлы отсутствуют, создаём их
	const prettierConfig = {
		trailingComma: 'es5',
		tabWidth: 2,
		semi: true,
		singleQuote: true,
	};
	await fs.writeJson(prettierConfigPath, prettierConfig, { spaces: 2 });
	console.log(chalk.green('📝 Создан .prettierrc.json'));

	const prettierIgnore = `
node_modules
dist
build
coverage
`;
	await fs.writeFile(prettierIgnorePath, prettierIgnore);
	console.log(chalk.green('📝 Создан .prettierignore'));
};
