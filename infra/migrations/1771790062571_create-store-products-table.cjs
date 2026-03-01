exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
      CREATE TABLE store_products (
        product_id SERIAL PRIMARY KEY,
        product_name VARCHAR(50) NOT NULL,
        short_description VARCHAR(200) NOT NULL,
        long_description VARCHAR(600),
        full_price DECIMAL(6, 2),
        qtt_in_stock SMALLINT,
        is_deleted BOOLEAN DEFAULT FALSE
      );
    `);
};

exports.down = (pgm) => {
    pgm.sql(
        `DROP TABLE store_products`
    )
};
