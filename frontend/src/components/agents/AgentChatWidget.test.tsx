import React from 'react';
import { render, screen } from '@testing-library/react';
import AgentChatWidget from './AgentChatWidget';

describe('AgentChatWidget Render Boundaries', () => {
    it('should auto-scroll to bottom layout dimensions cleanly during message arrival', () => {
        const messagesMock = [
            { id: 1, role: 'user', content: 'Hi' },
            { id: 2, role: 'assistant', content: 'Hello standard text sequence.' }
        ];

        const { rerender } = render(<AgentChatWidget messages={messagesMock} />);
        const container = screen.getByTestId('chat-scroller-viewport');

        const elementScrollMock = jest.fn();
        container.scrollTo = elementScrollMock;

        // Rerender component updates with trailing payload sequences
        const updatedMessages = [...messagesMock, { id: 3, role: 'assistant', content: 'New trace vector stream output.' }];
        rerender(<AgentChatWidget messages={updatedMessages} />);

        expect(elementScrollMock).toHaveBeenCalled();
    });
});
