export const moduleAreas = ['features', 'processors'];

const layers = [
  'domain',
  'outbound',
  'application',
  'infrastructure:core-adapters',
  'infrastructure:common-adapters',
  'infrastructure:lib-adapters',
  'infrastructure:queue',
  'infrastructure:config',
  'infrastructure',
  'presentation',
  'shell',
];

export const moduleAreaLayers = {
  features: layers,
  processors: layers.filter((layer) => layer !== 'presentation'),
};
