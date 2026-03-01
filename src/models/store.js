import database from "../../infra/database.js";

// Gets all available products in database
async function getAllProducts() {
  try {
    const res = await database.query({
      text: "SELECT * FROM store_products WHERE NOT is_deleted"
    });

    let parsedResponse = res.rows;
    return {product_list: parsedResponse}
  } catch (error) {
    throw error
  }
}

// Gets one product by its ID
async function getProductById(id) {
  try {
    const res = await database.query({
      text: "SELECT * FROM store_products WHERE product_id = $1 AND NOT is_deleted",
      values: [id]
    })

    let parsedResponse = res.rows[0]
    return {product: parsedResponse}
  } catch (error) {
    throw error
  }
}

// Posts new product, given its information (productObj)
async function postNewProduct(productObj) {
  try {
    const res = await database.query({
      text: "INSERT INTO TABLE store_products VLAUES ($1, $2, $3, $4, $5)",
      values: [productObj.produc_name, productObj.short_description, productObj.long_description, productObj.full_price, productObj.qtt_in_stock]
    })

    const parsedResponse = {status: 200}
    return parsedResponse
  } catch (error) {
    throw error
  }
}

// Updates any information in existing product by its Id
async function updateProductById(id, updatedProduct) {
  try {
    const res = await database.query({
      text: "UPDATE store_products SET proudct_name = $1, short_description = $2, long_description = $3, full_price = $4, qtt_in_stock = $5 WHERE product_id = $6",
      values: [updatedProduct.produc_name, updatedProduct.short_description, updatedProduct.long_description, updatedProduct.full_price, updatedProduct.qtt_in_stock, id]
    })

    const parsedResponse = {status: 200}
    return parsedResponse
  } catch (error) {
    throw error
  }
}

// Soft-deletes an existing product
async function deleteProductById(id) {
  try {
    const res = await database.query({
      text: "UPDATE store_products SET is_deleted = TRUE WHERE product_id = $1",
      values: [id]
    })

    const parsedResponse = {status: 200}
    return parsedResponse
  } catch (error) {
    throw error
  }
}

export default Object.freeze({
    getAllProducts,
    getProductById,
    postNewProduct,
    updateProductById,
    deleteProductById
});
