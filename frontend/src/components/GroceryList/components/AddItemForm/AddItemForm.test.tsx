// AddItemForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AddItemForm } from './AddItemForm';

describe('AddItemForm', () => {
  const user = userEvent.setup();
  let handleAdd: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handleAdd = vi.fn();
  });

  const renderComponent = (isSubmitting = false) => {
    return render(
      <AddItemForm onAdd={handleAdd} isSubmitting={isSubmitting} />
    );
  };

  describe('Rendering', () => {
    it('should render all form elements', () => {
      renderComponent();
      
      expect(screen.getByPlaceholderText('Add new item...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('should show "Adding..." text when submitting', () => {
      renderComponent(true);
      
      expect(screen.getByRole('button')).toHaveTextContent('Adding...');
    });
  });

  describe('Input Handling', () => {
    it('should update input value when typing', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('Add new item...');
      
      await user.type(input, 'New Item');
      
      expect(input).toHaveValue('New Item');
    });

    it('should disable input when submitting', () => {
      renderComponent(true);
      
      expect(screen.getByPlaceholderText('Add new item...')).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('should call onAdd with trimmed input value', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('Add new item...');
      const button = screen.getByRole('button');
      
      await user.type(input, '  New Item  ');
      await user.click(button);
      
      expect(handleAdd).toHaveBeenCalledWith('New Item');
      expect(handleAdd).toHaveBeenCalledTimes(1);
    });

    it('should clear input after successful submission', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('Add new item...');
      
      await user.type(input, 'New Item');
      await user.click(screen.getByRole('button'));
      
      expect(input).toHaveValue('');
    });

    it('should not submit when input is empty', async () => {
      renderComponent();
      const button = screen.getByRole('button');
      
      await user.click(button);
      
      expect(handleAdd).not.toHaveBeenCalled();
    });

    it('should not submit when input contains only whitespace', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('Add new item...');
      const button = screen.getByRole('button');
      
      await user.type(input, '   ');
      await user.click(button);
      
      expect(handleAdd).not.toHaveBeenCalled();
    });

    it('should not submit when form is already submitting', async () => {
      renderComponent(true);
      const input = screen.getByPlaceholderText('Add new item...');
      const button = screen.getByRole('button');
      
      await user.type(input, 'New Item');
      await user.click(button);
      
      expect(handleAdd).not.toHaveBeenCalled();
    });
  });

  describe('Button State', () => {
    it('should disable button when input is empty', () => {
      renderComponent();
      
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should disable button when submitting', () => {
      renderComponent(true);
      
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should enable button when input has valid text', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('Add new item...');
      
      await user.type(input, 'New Item');
      
      expect(screen.getByRole('button')).toBeEnabled();
    });
  });
});