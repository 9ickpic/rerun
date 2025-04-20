const fs = require('fs-extra');
const path = require('path');

module.exports.setup = async () => {
	console.log('⚙️ Настройка ESLint...');
	const eslintConfig = {
		env: {
			browser: true,
			es2021: true,
			node: true,
		},
		extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:tailwindcss/recommended', 'prettier'],
		parserOptions: {
			ecmaVersion: 12,
			sourceType: 'module',
		},
		plugins: ['react', 'react-hooks', 'tailwindcss'],
		rules: {
			'react/prop-types': 'off',
			'tailwindcss/classnames-order': 'warn',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	};

	try {
		await fs.writeJson('.eslintrc.json', eslintConfig, { spaces: 2 });
		console.log('📝 Файл .eslintrc.json создан');
	} catch (error) {
		throw new Error(`Ошибка при создании .eslintrc.json: ${error.message}`);
	}
};
