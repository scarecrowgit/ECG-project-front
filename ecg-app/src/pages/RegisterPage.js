import React, { useState } from 'react';
import axiosInstance from '../axios'; // Для API запросов
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [login, setLogin] = useState(''); // Поле login
  const [password, setPassword] = useState(''); // Поле password
  const [error, setError] = useState(''); // Для ошибок
  const [success, setSuccess] = useState(''); // Для успеха
  const navigate = useNavigate(); // Для перенаправления

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/register', { login, password });
      if (response.data.user_id) {
        setSuccess('Регистрация прошла успешно! Перенаправляем на страницу входа...');
        setTimeout(() => navigate('/login'), 2000); // Перенаправление через 2 секунды
      } else {
        setError(response.data.message || 'Ошибка регистрации.');
      }
    } catch (err) {
      setError('Ошибка при выполнении регистрации.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Регистрация</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;