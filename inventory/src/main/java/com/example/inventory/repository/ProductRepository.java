package com.example.inventory.repository;

import com.example.inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio de Spring Data JPA.
 * Al extender JpaRepository<Product, Long>, Spring Boot nos regala automáticamente
 * los métodos: save(), findAll(), findById(), deleteById(), sin escribir SQL manual.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}