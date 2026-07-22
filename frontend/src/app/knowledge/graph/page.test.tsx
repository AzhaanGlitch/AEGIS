import React from 'react';
import { render, screen } from '@testing-library/react';
import KnowledgeGraphPage from './page';

describe('KnowledgeGraph Visual Processing Engine Boundary Controls', () => {
    it('should fall back cleanly to secondary rendering boundaries if processing models are invalid', () => {
        // Pass corrupted relationship structures directly down the initialization graph tree
        const corruptedEntityNodeMap = { nodes: [{ id: '1' }], edges: [{ source: '1', target: 'non_existent_node_id' }] };

        render(<KnowledgeGraphPage graphData={corruptedEntityNodeMap} />);

        // Assert structural canvas fallbacks execute correctly
        expect(screen.getByTestId('graph-error-boundary-banner')).toBeInTheDocument();
    });
});
