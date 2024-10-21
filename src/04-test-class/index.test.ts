// Uncomment the code below and write your tests

import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '04-test-class';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(10);
    expect(account.getBalance()).toBe(10);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(10);
    expect(() => account.withdraw(20)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(10);
    const account2 = getBankAccount(5);
    expect(() => account1.transfer(20, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(10);
    expect(() => account.transfer(5, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(10);
    account.deposit(5);
    expect(account.getBalance()).toBe(15);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(10);
    account.withdraw(5);
    expect(account.getBalance()).toBe(5);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(10);
    const account2 = getBankAccount(5);
    account1.transfer(5, account2);
    expect(account1.getBalance()).toBe(5);
    expect(account2.getBalance()).toBe(10);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(10);
    const balance = await account.fetchBalance();
    expect(balance).toBeDefined();
    if (balance !== null) {
      expect(typeof balance).toBe('number');
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(10);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(20);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(20);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
