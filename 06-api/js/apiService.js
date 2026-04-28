'use strict';

const ApiService = {
  //baseUrl: 'https://jsonplaceholder.typicode.comXXX' //CREAR EL ERROR CON PETICION
  baseUrl: 'https://jsonplaceholder.typicode.com',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    if (response.status === 204) return null;

    return response.json();
  },

  async getPosts(limit = 10) {
    return this.request(`/posts?_limit=${limit}`);
  },

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  async updatePost(id, postData) {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData)
    });
  },

  async deletePost(id) {
    return this.request(`/posts/${id}`, {
      method: 'DELETE'
    });
  }
};