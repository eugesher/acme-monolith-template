import { boundariesOf, categoriesOf, policiesOf } from './helpers/index.mjs';
import { layers } from './layers/index.mjs';

const categories = categoriesOf(layers);
const policies = policiesOf(layers, categories);

export const boundaries = boundariesOf(categories, policies);
