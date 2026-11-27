export default {
  category: 'acme-libs',
  files: '{shell,*/shell}/**',
  allow: [
    '@acme-libs/<lib>/shell',
    '@acme-libs/<lib>/application',
    '@acme-libs/<lib>/infrastructure',
  ],
};
