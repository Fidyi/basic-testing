import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

jest.mock('lodash', () => ({
  throttle: (fn: any) => fn,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: 'some data' }),
    } as any);
  });

  test('should create instance with provided base url', async () => {
    const relativePath = '/posts';
    await throttledGetDataFromApi(relativePath);
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/posts';
    await throttledGetDataFromApi(relativePath);
    expect(mockedAxios.create().get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = '/posts';
    const mockResponse = { data: 'some data' };
    mockedAxios.create().get = jest.fn().mockResolvedValueOnce(mockResponse);
    const data = await throttledGetDataFromApi(relativePath);
    expect(data).toEqual(mockResponse.data);
  });
});
