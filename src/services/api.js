const API_BASE_URL = 'http://localhost:8080/api'; // Your Spring Boot backend URL
// ADD these authentication functions
export const authAPI = {
  // Login user
  login: async (loginData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Sign up user
  signup: async (signupData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      return data;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }
};

export const examVaultAPI = {
  // Get all exam papers with filters
  getExamPapers: async (semester, branch, type, year) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/resources?semester=${semester}&branch=${branch}&type=${type}&year=${year}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch exam papers');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching exam papers:', error);
      throw error;
    }
  },

  // Get available semesters
  getSemesters: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/semesters`);
      if (!response.ok) {
        throw new Error('Failed to fetch semesters');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching semesters:', error);
      throw error;
    }
  },

  // Get available branches
  getBranches: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/branches`);
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  // Get available years
  getYears: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/years`);
      if (!response.ok) {
        throw new Error('Failed to fetch years');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching years:', error);
      throw error;
    }
  },

  // Download exam paper
  downloadPaper: async (paperId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/exam-papers/${paperId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download paper');
      }
      return await response.blob();
    } catch (error) {
      console.error('Error downloading paper:', error);
      throw error;
    }
  },

  // Request a resource
  requestResource: async (requestData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resource-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit resource request');
      }
      return await response.json();
    } catch (error) {
      console.error('Error submitting resource request:', error);
      throw error;
    }
  }
};

export default examVaultAPI;
