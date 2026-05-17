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

    return (
  <>
      {/* 1. Kutu: Logo ve Başlık Kısmı */}
      <div className={`user-interface ${bgcolor} ${backendName} w-full max-w-md p-4 my-4 rounded-lg shadow-md`}>
          <img src={`/${backendName}.png`} alt={`${backendName} logo`} className="w-20 h-20 mb-6 mx-auto" />
          <h2 className="text-xl font-bold text-center text-white mb-6">
              {`${backendName.charAt(0).toUpperCase() + backendName.slice(1)} Backend`}
          </h2>
      </div>

      {/* 2. Kutu: Kullanıcı Listesi Kısmı */}
      <div className="space-y-4">
          {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between bg-white shadow-md rounded-lg p-4">
                  <CardComponent card={user} />
              </div>
          ))}
      </div>
  </>
    );
};
export default UserInterface



