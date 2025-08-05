# Getting Started

Welcome to the POS API documentation.

## Generating access token

All requests must contain authentication token.

#### API Key Header [Internal oath use only]

Complete the following steps to make your first API call via API Key Header:

- Get Access Token from frontend Authentication. `Note: if you are currently logged-in to frontend authentication. it will automatically attached the access token to the header per request`
- You may set the API key manually at the Authentication tab and mark the `api_key` option.
- Utilize any resource you want to access or query

#### Cookie Token [Internal oath use only]

Complete the following steps to make your first API call via Cookie Token:

- Get Access Token from frontend Authentication. `Note: if you are currently logged-in to frontend authentication. it will automatically attached the cookie token to the header per request`
- Utilize any resource you want to access or query

---

## Resources

| Resource                                               | Description                |
| ------------------------------------------------------ | -------------------------- |
| [➡️ Organization Resource](/api/docs#tag/organization) | Manage organizations       |
| [➡️ Event Resource](/api/docs#tag/events)              | Manage events              |
| [➡️ Payment Resource](/api/docs#tag/payments)          | Payment transactions       |
| [➡️ Customer Resource](/api/docs#tag/customer)         | Customers/Public endpoints |
| [➡️ Analytics Resource](/api/docs#tag/analytics)       | Analytics queries          |

---

## Errors

| Errors                                     | Code  | Type             | Description                                                     |
| ------------------------------------------ | ----- | ---------------- | --------------------------------------------------------------- |
| User not found [CODE: AD001]               | AD001 | Permission Error | User ID or Email not found                                      |
| Insufficient permissions [CODE: AD002]     | AD002 | Permission Error | Insufficient permissions. User not found or expired role access |
| Permission denied [CODE: AD003]            | AD003 | Permission Error | Permission not match with access role                           |
| Event not found [CODE: AD004]              | AD004 | Permission Error | Event not found from found event ID                             |
| Invalid event organization [CODE: AD005]   | AD005 | Permission Error | Organization not found associated with event ID                 |
| Invalid default organization [CODE: AD006] | AD006 | Permission Error | Error generating default personal organization ID               |
