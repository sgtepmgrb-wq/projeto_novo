'use client';

import { useActionState, useEffect, useRef } from 'react'; // <-- IMPORT CORRETO AQUI
import { useFormStatus } from 'react-dom';
import { createNewUser } from '@/app/actions/admin';
import { updateUser } from '@/app/actions/userManagement';

const initialState = { message: '', errors: {} };

function SubmitButton({ mode }: { mode: 'create' | 'edit' }) {
  const { pending } = useFormStatus();
  const text = mode === 'create' ? 'Criar Usuário' : 'Atualizar Usuário';
  return (
    <button type="submit" disabled={pending} className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
      {pending ? 'Salvando...' : text}
    </button>
  );
}

export default function UserForm({ mode, userToEdit, onFormSubmit, onCancel }: any) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = mode === 'create' ? createNewUser : updateUser;
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    // Verifica se a mensagem de estado contém a palavra 'sucesso'
    if (state?.message && state.message.includes('sucesso')) {
      onFormSubmit(); // Chama a função para atualizar a lista
      if (mode === 'create') {
        formRef.current?.reset();
      }
    }
  }, [state]);
  
  // Reseta o formulário quando sai do modo de edição
  useEffect(() => {
    if (mode === 'create') {
      formRef.current?.reset();
    }
  }, [mode]);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {mode === 'create' ? 'Criar Novo Usuário' : `Editando: ${userToEdit?.profile.full_name}`}
      </h1>
      <form action={formAction} ref={formRef} key={userToEdit?.id ?? 'create'}>
        {mode === 'edit' && <input type="hidden" name="id" value={userToEdit?.id} />}
        
        <div className="mb-4">
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input type="text" id="full_name" name="full_name" defaultValue={userToEdit?.profile.full_name} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
          <input type="email" id="email" name="email" defaultValue={userToEdit?.email} required={mode === 'create'} disabled={mode === 'edit'} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-200"/>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nova Senha</label>
          <input type="password" id="password" name="password" placeholder={mode === 'edit' ? 'Deixe em branco para não alterar' : ''} required={mode === 'create'} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo (Role)</label>
          <select id="role" name="role" defaultValue={userToEdit?.profile.role ?? 'fusex'} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="fusex">FUSEX</option>
            <option value="auditoria">Auditoria</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <SubmitButton mode={mode} />
          {mode === 'edit' && (
            <button type="button" onClick={onCancel} className="mt-4 w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600">
              Cancelar
            </button>
          )}
        </div>
        {state?.message && <p className="mt-2 text-sm">{state.message}</p>}
      </form>
    </div>
  );
}