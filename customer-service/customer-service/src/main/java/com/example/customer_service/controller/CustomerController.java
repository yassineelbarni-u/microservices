package com.example.customer_service.controller;

// REST Controller — handles all HTTP requests for the Customer resource

import com.example.customer_service.dto.CustomerDTO;
import com.example.customer_service.entity.Customer.CustomerStatus;
import com.example.customer_service.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomerService customerService;

    // Returns 201 Created + Location header pointing to the new resource
    @PostMapping
    public ResponseEntity<CustomerDTO.Response> createCustomer(
            @Valid @RequestBody CustomerDTO.Request request) {

        CustomerDTO.Response created = customerService.createCustomer(request);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    // Supports optional filtering by status or keyword search
    @GetMapping
    public ResponseEntity<List<CustomerDTO.Response>> getAllCustomers(
            @RequestParam(required = false) CustomerStatus status,
            @RequestParam(required = false) String search) {

        if (status != null) {
            return ResponseEntity.ok(customerService.getCustomersByStatus(status));
        }
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(customerService.searchCustomers(search));
        }
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO.Response> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<CustomerDTO.Response> getCustomerByEmail(@PathVariable String email) {
        return ResponseEntity.ok(customerService.getCustomerByEmail(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO.Response> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerDTO.Request request) {

        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CustomerDTO.Response> changeStatus(
            @PathVariable Long id,
            @RequestParam CustomerStatus newStatus) {

        return ResponseEntity.ok(customerService.changeCustomerStatus(id, newStatus));
    }

    // Returns 204 No Content on successful deletion
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
