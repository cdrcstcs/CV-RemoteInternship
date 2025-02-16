import { useUserStore } from '../../stores/useUserStore';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  const { user } = useUserStore();
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={user} />
      <div className="flex size-full flex-col">
          <Outlet />
      </div>
    </main>
  );
}
