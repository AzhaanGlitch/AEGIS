import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar Viewport and Layout Component Tests', () => {
    it('should structuralize correctly across window dynamic configuration sizing layout updates', () => {
        render(<Sidebar />);
        const sidebarContainer = screen.getByTestId('sidebar-container');

        // Simulate mobile viewport scale mutation trigger
        act(() => {
            global.innerWidth = 375;
            global.dispatchEvent(new Event('resize'));
        });

        expect(sidebarContainer.className).toContain('collapsed-mobile');
    });
});
