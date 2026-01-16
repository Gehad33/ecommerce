import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

export const api = {
  getProducts: () => axios.get(`${API_BASE_URL}/products`),
  getProduct: (id) => axios.get(`${API_BASE_URL}/products/${id}`),
  getCategories: () => axios.get(`${API_BASE_URL}/products/categories`),
  getProductsByCategory: (category) => 
    axios.get(`${API_BASE_URL}/products/category/${category}`),
};