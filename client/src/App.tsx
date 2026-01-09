import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  name: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ id: 0, email: '', name: '' });

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:4000/users');
    setUsers(res.data);
  };

  const addUser = async () => {
    await axios.post('http://localhost:4000/users', form);
    setForm({ id: 0, email: '', name: '' });
    fetchUsers();
  };

  const deleteUser = async (id: number) => {
    await axios.delete(`http://localhost:4000/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Mini RDBMS Users</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          placeholder="ID"
          value={form.id}
          onChange={e => setForm({ ...form, id: parseInt(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <button onClick={addUser}>Add User</button>
      </div>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
