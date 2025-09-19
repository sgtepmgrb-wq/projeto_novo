'use client';

import { useActionState } from 'react';
import { useState, useEffect } from 'react';
import { createNewUser } from '@/app/actions/admin';
import { getUsersWithProfiles, updateUser, deleteUser } from '@/app/actions/userManagement';
import { useAuth } from '@/contexts/AuthContext';
import UserForm from '@/components/UserForm';

type UserWithProfile = Awaited<ReturnType<typeof getUsersWithProfiles>>[0];

export default function ManageUsersPage() {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [editingUser, setEditingUser] = useState<UserWithProfile | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const refreshUserList = () => {
    getUsersWithProfiles().then(setUsers);
  };

  useEffect(() => {
    refreshUserList();
  }, []);

  const handleEdit = (user: UserWithProfile) => {
    setEditingUser(user);
    setMode('edit');
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setMode('create');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <UserForm 
        mode={mode}
        userToEdit={editingUser}
        onFormSubmit={() => {
          refreshUserList();
          handleCancelEdit();
        }}
        onCancel={handleCancelEdit}
      />

      <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden"> {/* Adicionado overflow-hidden aqui por segurança */}
        <h2 className="text-xl font-bold p-6 border-b">Usuários Cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
                <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                <th className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden truncate" title={user.profile.full_name}>{user.profile.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden truncate" title={user.email}>{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.profile.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                    
                    {adminUser?.id !== user.id && (
                      <form action={deleteUser} onSubmit={(e) => { if(!confirm('Tem certeza que deseja excluir este usuário?')) e.preventDefault(); else setTimeout(refreshUserList, 500); }} className="inline">
                        <input type="hidden" name="id" value={user.id} />
                        <button type="submit" className="text-red-600 hover:text-red-900">Excluir</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}