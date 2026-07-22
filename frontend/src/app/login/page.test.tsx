import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';

describe('LoginPage Security Validation Controls', () => {
    it('should halt dispatch updates on structural submission configuration fields validation fault', async () => {
        render(<LoginPage />);
        const submitBtn = screen.getByRole('button', { name: /sign in/i });

        // Trigger submission sequences without credential arguments
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/email field is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password field is required/i)).toBeInTheDocument();
        });
    });
});
