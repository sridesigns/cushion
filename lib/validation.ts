import { VALIDATION } from './constants'

/**
 * Validation utilities for user inputs
 * Ensures data integrity and prevents injection attacks
 */

/**
 * Sanitizes string input by trimming and limiting length
 */
export function sanitizeString(input: string, maxLength: number): string {
  return input.trim().slice(0, maxLength)
}

/**
 * Validates and sanitizes amount input
 */
export function validateAmount(amount: string | number): number | null {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount) || !isFinite(numAmount)) {
    return null
  }

  if (numAmount < VALIDATION.MIN_AMOUNT || numAmount > VALIDATION.MAX_AMOUNT) {
    return null
  }

  // Round to 2 decimal places
  return Math.round(numAmount * 100) / 100
}

/**
 * Validates category input
 */
export function validateCategory(category: string): string | null {
  const sanitized = sanitizeString(category, VALIDATION.MAX_CATEGORY_LENGTH)
  return sanitized.length > 0 ? sanitized : null
}

/**
 * Validates description input
 */
export function validateDescription(description: string): string {
  return sanitizeString(description, VALIDATION.MAX_DESCRIPTION_LENGTH)
}

/**
 * Validates date input
 */
export function validateDate(date: string): string | null {
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return null
  }
  return date
}

/**
 * Validates transaction type
 */
export function validateTransactionType(type: string): 'deposit' | 'withdrawal' | null {
  if (type === 'deposit' || type === 'withdrawal') {
    return type
  }
  return null
}
