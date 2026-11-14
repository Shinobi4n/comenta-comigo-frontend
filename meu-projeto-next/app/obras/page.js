'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function ObrasPage() {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a lista de obras do backend
    api.get('/obras')
      .then((response) => {
        setObras(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar obras:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando obras...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Obras</h1>
      <ul>
        {obras.map((obra) => (
          <li key={obra.id}>
            <strong>{obra.titulo}</strong> ({obra.tipoObra})
          </li>
        ))}
      </ul>
    </div>
  );
}