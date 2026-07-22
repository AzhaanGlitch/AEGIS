import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../context/AppContext';

const TestingConsumer = () => {
    const { state, logout } = useAppContext();
    return (
        <div>
            <span data-testid="user">{state.user ? state.user.email : 'Guest'}</span>
            <button onClick={logout} data-testid="logout-btn">Logout</button>
        </div>
    );
};

describe('AppContext Persistent Engine State Core Tests', () => {
    it('should fall back cleanly to safe defaults if localStorage contains malformed metadata', () => {
        // Edge Case: LocalStorage state corruption simulation
        window.localStorage.setItem('aegis_session', 'invalid_corrupted_json_brackets}');

        render(
            <AppProvider>
                <TestingConsumer />
            </AppProvider>
        );

        expect(screen.getByTestId('user').textContent).toBe('Guest');
    });
});
