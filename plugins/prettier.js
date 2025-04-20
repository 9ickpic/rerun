const fs = require('fs-extra');
const path = require('path');

module.exports.setup = async () => {
	console.log('⚙️ Настройка Prettier...');
	const prettierConfig = {
		trailingComma: 'es5',
		tabWidth: 2,
		semi: true,
		singleQuote: true,
		printWidth: 80,
	};

	const prettierIgnore = `
node_modules
dist
build
coverage
`;

	try {
		await fs.writeJson('.prettierrc.json', prettierConfig, { spaces: 2 });
		console.log('📝 Файл .prettierrc.json создан');
		await fs.writeFile('.prettierignore', prettierIgnore);
		console.log('📝 Файл .prettierignore создан');
	} catch (error) {
		throw new Error(`Ошибка при создании конфигурации Prettier: ${error.message}`);
	}
};
