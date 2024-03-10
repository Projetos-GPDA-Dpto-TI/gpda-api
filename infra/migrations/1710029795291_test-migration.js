/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('member', {
    id: 'SERIAL PRIMARY KEY',
    username: { type: 'VARCHAR(50)', notNull: true, unique: true },
    email: { type: 'VARCHAR(100)', notNull: true, unique: true },
    name: 'VARCHAR(100)',
    image_url: 'VARCHAR(255)',
    role: 'VARCHAR(50)',
    created_at: { type: 'TIMESTAMP', default: pgm.func('current_timestamp') },
    updated_at: { type: 'TIMESTAMP', default: pgm.func('current_timestamp') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('member');
};
