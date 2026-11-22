export const queue = [
  {
    from: { file: { categories: 'acme-app:processors:shell' } },
    disallow: [
      {
        to: { file: { categories: 'acme-app:processors:outbound' } },
        dependency: { specifiers: ['!*_QUEUE'] },
      },
    ],
    message: 'a processor takes only the queue name from the outbound of its module',
  },
];
