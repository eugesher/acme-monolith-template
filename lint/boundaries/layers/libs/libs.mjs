export default [
  {
    category: 'libs',
    pattern: 'libs/*/src/**',
    capture: ['lib', 'file'],
    allow: ['@acme-libs/contracts/<lib>'],
  },
  {
    category: 'libs',
    files:
      '!{shell,*/shell,application,*/application,infrastructure,*/infrastructure,outbound,*/outbound}/**',
    allow: ['@acme-libs/<lib>'],
  },
];
