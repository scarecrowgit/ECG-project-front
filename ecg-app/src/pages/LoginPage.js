import React, { useState } from 'react';
import axiosInstance from '../axios'; // Используется для запросов к API
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [login, setLogin] = useState(''); // Поле login
  const [password, setPassword] = useState(''); // Поле password
  const [error, setError] = useState(''); // Отображение ошибок
  const navigate = useNavigate(); // Для перенаправления

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/login', { login, password });
      if (response.data.user_id) {
        // Сохранение user_id для дальнейших запросов
        localStorage.setItem('user_id', response.data.user_id);
        // Перенаправление на страницу ECG
        navigate('/ecg');
      } else {
        setError('Неверный логин или пароль.');
      }
    } catch (err) {
      setError('Ошибка при выполнении авторизации.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Авторизация</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
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
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginPage;