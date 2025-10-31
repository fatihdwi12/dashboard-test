export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
}
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
