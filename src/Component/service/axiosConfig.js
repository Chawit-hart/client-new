import axios from 'axios';

const axiosInstance = axios.create();

// ตั้งค่า interceptor สำหรับการตอบกลับ (response)
axiosInstance.interceptors.response.use(response => {
  const newToken = response.headers['authorization'];
  if (newToken) {
    localStorage.setItem('token', newToken);
  }
  return response;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;
