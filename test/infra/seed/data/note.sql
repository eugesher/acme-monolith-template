INSERT INTO note (
  id,
  subject_type,
  subject_id,
  title,
  body,
  author_id,
  resolved,
  version,
  created_at,
  updated_at,
  deleted_at
)
VALUES
  (
    200,
    'product',
    '100',
    'Customer call',
    'Customer called about this.',
    1,
    0,
    1,
    '2026-01-01 00:00:00',
    '2026-01-01 00:00:00',
    NULL
  ),
  (
    201,
    'product',
    '100',
    'Supplier',
    'Check the supplier.',
    1,
    0,
    1,
    '2026-01-01 00:00:00',
    '2026-01-01 00:00:00',
    NULL
  ),
  (
    202,
    'product',
    '101',
    'Handled',
    'Already handled.',
    1,
    1,
    2,
    '2026-01-01 00:00:00',
    '2026-01-01 00:00:00',
    NULL
  ),
  (
    203,
    'ticket',
    'T-1',
    'Updated while a revision is taken.',
    'Updated while a revision is taken.',
    1,
    0,
    1,
    '2026-01-01 00:00:00',
    '2026-01-01 00:00:00',
    NULL
  ),
  (
    204,
    'ticket',
    'T-2',
    'Updated with the same body.',
    'Updated with the same body.',
    1,
    0,
    1,
    '2026-01-01 00:00:00',
    '2026-01-01 00:00:00',
    NULL
  );
