import { Suspense } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import SearchBar from './components/SearchBar';
import ViewToggle from './components/ViewToggle';
import KanbanBoard from './components/KanbanBoard';
import DataTable from './components/DataTable';
import ApplicationModal from './components/ApplicationModal';
import { AppProvider, useApp } from './context/AppContext';

function MainContent() {
  const { viewMode, modalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <SearchBar />
          <ViewToggle />
        </div>
        <StatsBar />
        <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
          {viewMode === 'kanban' ? <KanbanBoard /> : <DataTable />}
        </Suspense>
      </main>
      {modalOpen && <ApplicationModal />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
