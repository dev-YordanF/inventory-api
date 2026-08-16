package com.example.inventory.service;

import com.example.inventory.model.Product;
import java.util.List;

/**
 * Contrato de interfaz que define las 5 operaciones principales del CRUD.
 */
public interface ProductService {

    Product saveProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product updateProduct(Long id, Product productDetails);

    void deleteProduct(Long id);
}