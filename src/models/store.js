import database from "../../infra/database.js";

let mockProdutos = [
  {
    product_id: 1,
    product_name: "Camiseta Algodão Orgânico",
    product_description: "Camiseta 100% algodão orgânico, cor branca, estampa minimalista 'Natureza'. Tamanho M.",
    product_price: 79.90,
    is_product_available: true,
    is_deleted: false
  },
  {
    product_id: 2,
    product_name: "Boné Aba Curva Clássico",
    product_description: "Boné unissex, cor preta, ajustável, logo bordado frontal. Ideal para o dia a dia.",
    product_price: 45.50,
    is_product_available: true,
    is_deleted: false
  },
  {
    product_id: 3,
    product_name: "Garrafa Térmica Aço Inoxidável",
    product_description: "Garrafa de 500ml, aço inoxidável, mantém a bebida quente por 12h e fria por 24h. Cor azul marinho.",
    product_price: 99.00,
    is_product_available: true,
    is_deleted: false
  },
  {
    product_id: 4,
    product_name: "Camiseta Dry-Fit Esportiva",
    product_description: "Camiseta para prática de esportes, tecido Dry-Fit respirável, cor cinza mescla. Tamanho G.",
    product_price: 65.00,
    is_product_available: false,
    is_deleted: false
  },
  {
    product_id: 5,
    product_name: "Boné Trucker Tela Respirável",
    product_description: "Boné estilo Trucker, frontal azul e tela branca, fecho de pressão ajustável.",
    product_price: 52.99,
    is_product_available: true,
    is_deleted: false
  }
];

// Gets all available products in database
async function getAllProducts() {
    return mockProdutos;
}

// Gets one product by its ID
async function getProductById(id) {
    return mockProdutos[id-1];
}

// Posts new product, given its information (productObj)
async function postNewProduct(productObj) {
    let newProduct = {
        id: mockProdutos.length() + 1,
        product_name: productObj.product_name,
        product_description: productObj.product_description,
        product_price: productObj.product_price,
        is_product_available: productObj.is_product_available
    };

    mockProdutos.push(newProduct);

    return `Added ${mockProdutos[newProduct.id - 1].product_name} successfully`;
}

// Updates any information in existing product by its Id
async function updateProductById(id, updatedProduct) {
    mockProdutos[id-1] = updatedProduct;

    return `Updated product ${mockProdutos[id-1].product_name} successfully`
}

// Soft-deletes an existing product
async function deleteProductById(id) {
    mockProdutos[id-1].is_deleted = true;

    return `Product ${mockProdutos[id-1].product_name} soft-deleted successfully`
}

export default Object.freeze({
    getAllProducts,
    getProductById,
    postNewProduct,
    updateProductById,
    deleteProductById
});
