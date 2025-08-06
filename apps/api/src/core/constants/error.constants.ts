export const APP_ERROR = {
  // Authentication & User Management
  auth: {
    email_taken: 'Email already in use!',
    invalid_credentials: 'Invalid email or password!',
    session_expired: 'Your session has expired. Please log in again.',
    unauthorized: 'You are not authorized to perform this action.',
    account_locked: 'Account locked. Too many failed attempts.',
    password_weak:
      'Password must be at least 8 characters with mixed case, numbers, and special characters.',
  },

  // Inventory Management
  inventory: {
    not_found: 'Product not found!',
    out_of_stock: 'Product is out of stock!',
    low_stock: (quantity: number) => `Only ${quantity} items left in stock!`,
    sku_exists: 'SKU already exists for another product!',
    invalid_barcode: 'Invalid barcode format!',
  },

  // Transactions & Sales
  transaction: {
    invalid_payment: 'Invalid payment method!',
    payment_failed: 'Payment processing failed!',
    refund_failed: 'Refund could not be processed!',
    minimum_amount: (amount: number) =>
      `Minimum transaction amount is ${amount}!`,
    receipt_failed: 'Receipt generation failed!',
    void_failed: 'Failed to void transaction!',
  },

  // Customer Management
  customer: {
    not_found: 'Customer not found!',
    phone_exists: 'Phone number already registered!',
    loyalty_points: 'Not enough loyalty points!',
  },

  // Employee Management
  employee: {
    not_found: 'Employee not found!',
    pin_exists: 'PIN already in use!',
    shift_active: 'Employee already has an active shift!',
    shift_not_started: 'Shift not started!',
  },

  // System & General Errors
  system: {
    offline: 'POS system is offline!',
    printer_error: 'Printer connection error!',
    database: 'Database operation failed!',
    network: 'Network connection error!',
    maintenance: 'System under maintenance!',
  },

  // Validation Errors
  validation: {
    invalid_input: 'Invalid input data!',
    missing_fields: 'Required fields are missing!',
    invalid_date: 'Invalid date format!',
    invalid_quantity: 'Quantity must be a positive number!',
  },

  // Discounts & Promotions
  discount: {
    expired: 'Discount code has expired!',
    invalid: 'Invalid discount code!',
    minimum_order: 'Discount requires minimum order amount!',
    limit_reached: 'Discount usage limit reached!',
  },
};
