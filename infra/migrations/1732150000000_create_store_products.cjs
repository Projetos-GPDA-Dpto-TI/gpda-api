
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE store_products (
      product_id SERIAL PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      product_description VARCHAR(255),
      product_price FLOAT4 NOT NULL,
      is_product_available BOOL NOT NULL,
      is_deleted BOOL NOT NULL
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE store_products;
  `);
};

