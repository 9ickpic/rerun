const Fuse = require('fuse.js');

const availablePackages = ['why-did-you-render', 'eslint-plugin-tailwindcss', 'framer-motion', 'tailwindcss', 'postcss', 'autoprefixer', 'sass', 'prettier', 'eslint-config-prettier', 'eslint-plugin-react', 'eslint-plugin-react-hooks', 'clsx', 'lucide-react', '@headlessui/react', 'zod', 'react-loading-skeleton', 'react-hot-toast', 'react-hook-form', 'uuid', 'lodash', 'axios', 'zustand', 'openai', 'fuse.js', 'msw'];

const fuse = new Fuse(availablePackages, {
	includeScore: true,
	threshold: 0.3,
});

module.exports.searchPackages = async (input = '') => {
	if (!input) return availablePackages;
	return fuse.search(input).map(result => result.item);
};
