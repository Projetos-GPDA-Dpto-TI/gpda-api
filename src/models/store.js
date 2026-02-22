import database from "../../infra/database.js";

// Gets all available products in database
async function getAllProducts() {
  return
}

// Gets one product by its ID
async function getProductById(id) {
  return
}

// Posts new product, given its information (productObj)
async function postNewProduct(productObj) {
  return
}

// Updates any information in existing product by its Id
async function updateProductById(id, updatedProduct) {
  return 
}

// Soft-deletes an existing product
async function deleteProductById(id) {
  return
}

export default Object.freeze({
    getAllProducts,
    getProductById,
    postNewProduct,
    updateProductById,
    deleteProductById
});
