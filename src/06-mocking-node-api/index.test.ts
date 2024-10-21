import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('path', () => ({
  join: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    const timeout = 1000;

    (global.setTimeout as unknown as jest.Mock) = jest.fn((cb) => cb());

    doStuffByTimeout(mockCallback, timeout);

    expect(global.setTimeout).toHaveBeenCalledWith(
      expect.any(Function),
      timeout,
    );
  });

  test('should call callback only after timeout', () => {
    const mockCallback = jest.fn();
    const timeout = 1000;

    (global.setTimeout as unknown as jest.Mock) = jest.fn((cb) => cb());

    doStuffByTimeout(mockCallback, timeout);
    jest.advanceTimersByTime(timeout);
    expect(mockCallback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    const interval = 1000;

    (global.setInterval as unknown as jest.Mock) = jest.fn();

    doStuffByInterval(mockCallback, interval);
    expect(global.setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      interval,
    );
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCallback = jest.fn();
    const interval = 1000;

    (global.setInterval as unknown as jest.Mock) = jest.fn((cb) => {
      cb();
      cb();
      cb();
    });

    doStuffByInterval(mockCallback, interval);
    jest.advanceTimersByTime(interval * 3);
    expect(mockCallback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockFilePath = 'test.txt';
  const mockFullPath = '/mock/full/path/test.txt';

  beforeEach(() => {
    (join as jest.Mock).mockReturnValue(mockFullPath);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    await readFileAsynchronously(mockFilePath);
    expect(join).toHaveBeenCalledWith(__dirname, mockFilePath);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const mockContent = 'file content';
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(mockContent));
    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBe(mockContent);
  });
});
