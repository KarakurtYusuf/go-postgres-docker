'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';
import { div } from 'framer-motion/m';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserInterfaceProps {
    backendName: string;
}

const UserInterface: React.FC<UserInterfaceProps> = ({ backendName }) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ name: '', email: '' });
    const[updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });

    const backgroundColors: { [key: string]: string } = {
        go: 'bg-cyan-500',
    };

    const buttonColors: { [key: string]: string } = {
        go: 'bg-cyan-700 hover:bg-blue-600',
    };

    const bgcolor = backgroundColors[backendName as keyof typeof backgroundColors] || 'bg-gray-200';
    const btnColor = buttonColors[backendName as keyof typeof buttonColors] || 'bg-gray-500 hover:bg-gray-600';
 

    // Fetch users from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users`);
                setUsers(response.data.reverse());
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, [backendName, apiUrl]);

    // Kullanıcı ekleme fonksiyonu
    const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiUrl}/api/users`, newUser);
            setUsers([response.data, ...users]);
            setNewUser({ name: '', email: '' });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    // Kullanıcı güncelleme fonksiyonu
    const updateUserFunc = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`${apiUrl}/api/users/${updateUser.id}`, { name: updateUser.name, email: updateUser.email });
            setUpdateUser({ id: '', name: '', email: '' });
            // Güncellenen kullanıcıyı state'te güncelle
            setUsers(
                users.map((user) => {
                    if (user.id === parseInt(updateUser.id)) {
                        return { ...user, name: updateUser.name, email: updateUser.email };
                    }
                    return user;
                })
            );
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Kullanıcı silme fonksiyonu
    const deleteUser = async (userId: number) => {
        try {
            await axios.delete(`${apiUrl}/api/users/${userId}`);
            setUsers(users.filter((user) => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
  <>
      {/* 1. Kutu: Logo ve Başlık Kısmı */}
<div className={`user-interface ${bgcolor} ${backendName} w-full flex flex-col items-center justify-center p-6 mb-6 rounded-lg shadow-md`}>
    <img src={`/${backendName}.svg`} alt={`${backendName} logo`} className="w-20 h-20 mb-4 mx-auto" />
    <h2 className="text-xl font-bold text-center text-white">
        {`${backendName.charAt(0).toUpperCase() + backendName.slice(1)} Backend`}
    </h2>
</div>

      {/* Kullanıcı Ekleme Formu */}
        <form onSubmit={createUser} className="mb-6 p-4 bg-blue-100 rounded shadow">
            <input
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="mb-2 p-2 w-full border-gray-300 rounded"
            />
            <input
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="mb-2 p-2 w-full border-gray-300 rounded"
            />
            <button type="submit" className='w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600'>
                Add User
            </button>
        </form>


        {/* Kullanıcı Güncelleme Formu */}
        <form onSubmit={updateUserFunc} className="mb-6 p-4 bg-green-100 rounded shadow">
           
            <input
                placeholder="New Name"
                value={updateUser.name}
                onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
                className="mb-2 p-2 w-full border-gray-300 rounded"
            />
            <input
                placeholder="New Email"
                value={updateUser.email}
                onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
                className="mb-2 p-2 w-full border-gray-300 rounded"
            />
            <button type="submit" className='w-full p-2 text-white bg-green-500 rounded hover:bg-green-600'>
                Update User
            </button>
        </form>

      {/* 2. Kutu: Kullanıcı Listesi Kısmı */}
      <div className="space-y-4">
          {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between bg-white shadow-md rounded-lg p-4">
                  <CardComponent card={user} />
                 <button onClick={() => setUpdateUser({ id: String(user.id), name: user.name, email: user.email })} className='p-2 text-white bg-yellow-500 rounded hover:bg-yellow-600'>
                      Update User
                </button>
                  <button 
                      onClick={() => deleteUser(user.id)} 
                      className='p-2 text-white bg-red-500 rounded hover:bg-red-600'>
                      Delete User
                  </button>
              </div>
          ))}
      </div>
  </>
    );
};
export default UserInterface



