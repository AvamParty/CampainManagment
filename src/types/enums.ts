// Shared enum types from backend Prisma schema
// These types are used across the frontend for type safety

export type UserRole = 'user' | 'admin' | 'manager'
export type OtpPurpose = 'login' | 'register' | 'reset'
export type OtpChannel = 'sms'
