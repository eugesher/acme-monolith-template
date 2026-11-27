export default [
  {
    category: 'acme-libs',
    pattern: 'libs/*/src/**',
    capture: ['lib', 'file'],
    allow: ['@acme-libs/contracts/<lib>'],
  },
  {
    category: 'acme-libs',
    files:
      '!{shell,*/shell,application,*/application,infrastructure,*/infrastructure,outbound,*/outbound}/**',
    allow: ['@acme-libs/<lib>'],
  },
];
