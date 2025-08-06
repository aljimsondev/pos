export const CACHE_KEY = {
  product: (slug: string) => `product:${slug}`,
  user: (id: string) => `user:${id}`,
  session: (session_id: string) => `session:${session_id}`,
  token: (token: string) => `token:${token}`,
};
