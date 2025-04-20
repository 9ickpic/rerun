const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const tailwindPlugin = require('../plugins/tailwind');
const eslintPlugin = require('../plugins/eslint');
const prettierPlugin = require('../plugins/prettier');
const framerMotionPlugin = require('../plugins/framer-motion');

const plugins = {
	tailwindcss: tailwindPlugin,
	eslint: eslintPlugin,
	prettier: prettierPlugin,
	'framer-motion': framerMotionPlugin,
};

module.exports.installPackages = async (packages, cwd) => {
	if (!packages.length) {
		console.log('ℹ️ Нет пакетов для установки');
		return;
	}
	console.log('📦 Установка пакетов:', packages.join(', '));
	try {
		execSync(`npm install ${packages.join(' ')}`, { cwd, stdio: 'inherit' });
	} catch (error) {
		throw new Error(`Не удалось установить пакеты: ${error.message}`);
	}
};

module.exports.setupPackage = async (packageName, frontendDir) => {
	const plugin = plugins[packageName];
	if (plugin) {
		console.log(`⚙️ Настройка ${packageName}...`);
		try {
			await plugin.setup(frontendDir);
		} catch (error) {
			throw new Error(`Не удалось настроить ${packageName}: ${error.message}`);
		}
	} else {
		console.log(`ℹ️ Для ${packageName} автонастройка не требуется`);
	}
};
