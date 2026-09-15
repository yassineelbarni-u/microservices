package com.example.customer_service.service;

// Business logic layer — all customer operations go through here

import com.example.customer_service.dto.CustomerDTO;
import com.example.customer_service.entity.Customer;
import com.example.customer_service.entity.Customer.CustomerStatus;
import com.example.customer_service.exception.CustomerAlreadyExistsException;
import com.example.customer_service.exception.CustomerNotFoundException;
import com.example.customer_service.mapper.CustomerMapper;
import com.example.customer_service.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    // Validates email uniqueness before saving
    @Transactional
    public CustomerDTO.Response createCustomer(CustomerDTO.Request request) {
        log.info("Creating customer with email: {}", request.getEmail());

        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new CustomerAlreadyExistsException(request.getEmail());
        }

        Customer customer = customerMapper.toEntity(request);
        Customer saved = customerRepository.save(customer);

        log.info("Customer created with id: {}", saved.getId());
        return customerMapper.toResponse(saved);
    }

    public List<CustomerDTO.Response> getAllCustomers() {
        log.debug("Fetching all customers");
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toResponse)
                .toList();
    }

    public CustomerDTO.Response getCustomerById(Long id) {
        log.debug("Fetching customer with id: {}", id);
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
        return customerMapper.toResponse(customer);
    }

    public CustomerDTO.Response getCustomerByEmail(String email) {
        log.debug("Fetching customer with email: {}", email);
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new CustomerNotFoundException(email));
        return customerMapper.toResponse(customer);
    }

    public List<CustomerDTO.Response> searchCustomers(String keyword) {
        log.debug("Searching customers with keyword: {}", keyword);
        return customerRepository.searchByName(keyword)
                .stream()
                .map(customerMapper::toResponse)
                .toList();
    }

    public List<CustomerDTO.Response> getCustomersByStatus(CustomerStatus status) {
        log.debug("Fetching customers with status: {}", status);
        return customerRepository.findByStatus(status)
                .stream()
                .map(customerMapper::toResponse)
                .toList();
    }

    // Guards against email conflicts with other existing customers
    @Transactional
    public CustomerDTO.Response updateCustomer(Long id, CustomerDTO.Request request) {
        log.info("Updating customer with id: {}", id);

        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        if (customerRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new CustomerAlreadyExistsException(request.getEmail());
        }

        customerMapper.updateEntityFromDto(request, existing);
        Customer updated = customerRepository.save(existing);

        log.info("Customer updated with id: {}", updated.getId());
        return customerMapper.toResponse(updated);
    }

    @Transactional
    public CustomerDTO.Response changeCustomerStatus(Long id, CustomerStatus newStatus) {
        log.info("Changing status of customer {} to {}", id, newStatus);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        customer.setStatus(newStatus);
        Customer updated = customerRepository.save(customer);

        return customerMapper.toResponse(updated);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        log.info("Deleting customer with id: {}", id);

        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException(id);
        }
        customerRepository.deleteById(id);
        log.info("Customer deleted with id: {}", id);
    }
}
