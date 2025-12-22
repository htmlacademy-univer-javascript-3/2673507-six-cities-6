import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import LoginPage from './login-page';

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../store/api-actions', () => ({
  loginAction: vi.fn((data: { email: string; password: string }) => ({
    type: 'user/login',
    payload: data,
  })),
}));

import { loginAction } from '../../store/api-actions';

describe('Компонент: LoginPage', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockNavigate.mockReset();
  });

  it('не должен отправлять форму при пустом пароле', () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '   ' } });

    fireEvent.click(submitButton);

    expect(loginAction).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('должен диспатчить loginAction и переходить на главную страницу при валидных данных', async () => {
    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve(),
    }));

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    const email = 'user@example.com';
    const password = 'password123';

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });

    fireEvent.click(submitButton);

    expect(loginAction).toHaveBeenCalledWith({ email, password });
    expect(mockDispatch).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
