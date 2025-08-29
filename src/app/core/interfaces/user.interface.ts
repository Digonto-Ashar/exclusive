export interface User {
  id: number;
  name: string;
  email: string;
  // Add any other properties that your user object has,
  // for example, an access token.
  token?: string; 
}
