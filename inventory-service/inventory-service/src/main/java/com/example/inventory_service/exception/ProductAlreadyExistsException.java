package com.example.inventory_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ProductAlreadyExistsException extends RuntimeException {

    public ProductAlreadyExistsException(String name, String category) {
        super("Product '" + name + "' already exists in category '" + category + "'");
    }
}
