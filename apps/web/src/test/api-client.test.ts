import { describe, it, expect } from 'vitest';
import { ApiError } from '@/lib/api';

describe('API Client & Error Handling', () => {
  it('instantiates ApiError with correct status and code', () => {
    const error = new ApiError(404, 'NOT_FOUND', 'Profile not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Profile not found');
    expect(error.name).toBe('ApiError');
  });

  it('handles server 500 error gracefully', () => {
    const error = new ApiError(500, 'INTERNAL_SERVER_ERROR', 'Unexpected error occurred');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_SERVER_ERROR');
  });
});

