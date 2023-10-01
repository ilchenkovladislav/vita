import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from './providers/ThemeProvider';
import { Header } from './components/Header/Header';
import { AdminPanel } from './pages/AdminPanel/AdminPanel';
import { UserPage } from './pages/UserPage/UserPage';
import { useStateSelector, useActionCreators } from './store/hooks';
import { pageAsyncActions } from './store/slices/pageSlice';
import './App.scss';

function App() {
    const pagesStatus = useStateSelector((state) => state.pages.status);
    const actions = useActionCreators(pageAsyncActions);

    useEffect(() => {
        if (pagesStatus === 'init') {
            actions.getPages();
        }
    }, [pagesStatus]);

    return (
        <div className="app">
            <ErrorBoundary>
                <ThemeProvider>
                    <Header />
                </ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="admin" element={<AdminPanel />} />
                        <Route path="page/:href" element={<UserPage />} />
                        <Route
                            path="*"
                            element={<h1>Страница не найдена</h1>}
                        />
                    </Routes>
                </BrowserRouter>
            </ErrorBoundary>
        </div>
    );
}

export default App;
