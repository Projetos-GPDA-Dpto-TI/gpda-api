exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        CREATE TABLE store_product_images (
            image_id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL,
            image_url TEXT,

            CONSTRAINT fk_product_id 
                FOREIGN KEY (product_id) 
                REFERENCES store_products(product_id) 
                ON DELETE CASCADE
        );
    `);
};

exports.down = (pgm) => {
    pgm.sql(
        `DROP TABLE store_product_images`
    )
};