import React from 'react';
import { StoreProvider, useStore } from '../context/StoreContext';
import StoreFront from './StoreFront';
import AdminPanel from './AdminPanel';
import Toast from './store/Toast';

function MainApp() {
  const { isAdminMode, currentUser } = useStore();
  const showAdmin = isAdminMode && currentUser && currentUser.role === 'admin';

  return (
    <div className="min-h-screen transition-colors duration-500">
      {showAdmin ? <AdminPanel /> : <StoreFront />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

