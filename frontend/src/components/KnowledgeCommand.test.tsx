import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KnowledgeCommand from './KnowledgeCommand';

describe('KnowledgeCommand Fuzzy Palette Core Execution Engine', () => {
    it('should isolate UI components cleanly under structural input overflows', () => {
        render(<KnowledgeCommand open={true} />);
        const inputField = screen.getByPlaceholderText('Search agents, files...');

        // Edge Case: Intentionally overflow input bounds to stress parse layout structures
        const maliciousOverflowInput = 'A'.repeat(5000);
        fireEvent.change(inputField, { target: { value: maliciousOverflowInput } });

        const resultsPanel = screen.getByTestId('search-results-viewport');
        expect(resultsPanel).toBeInChek;
        expect(screen.getByText('No matches found')).toBeInTheDocument();
    });
});
