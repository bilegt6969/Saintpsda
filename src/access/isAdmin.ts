// src/access/isAdmin.ts
import type { Access } from 'payload'
// You still might need this import for type casting/assertion inside the function if needed
import type { User } from '../payload-types'

/**
 * Grants access only to logged-in users with the 'admin' role.
 * Assumes the User collection has a 'roles' field (array of strings).
 */
 // FIX: Removed the second type argument '<any, User>' -> '<>' or just 'Access'
export const isAdmin: Access = ({ req: { user } }) => {
  // Payload usually infers 'user' correctly here.
  // Optionally, add type assertion for extra safety if needed:
  // const typedUser = user as User | undefined;
  // return Boolean(typedUser?.roles?.includes('admin'))

  // Usually, this is sufficient:
  return Boolean(user?.roles?.includes('admin'))
}

/**
 * Optional: Grants access to admins OR the user themselves (for reading/updating their own data).
 * Not needed for the Orders collection access as defined previously, but useful elsewhere.
 */
 // FIX: Removed the second type argument '<any, User>' -> '<>' or just 'Access'
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // Optionally add type assertion:
  // const typedUser = user as User | undefined;
  const typedUser = user as User | undefined; // Added assertion for clarity


  if (typedUser) {
    // If user has role of 'admin' grant access
    if (typedUser.roles?.includes('admin')) {
      return true;
    }

    // If user is the owner (themselves), grant access via query constraint
    return {
      id: {
        equals: typedUser.id,
      },
    };
  }

  // Reject otherwise
  return false;
}