import AxiosClient from './axios.client';

const path = `/v1/`;

const GrammarApi = {
  initData: async (data: any) => {
    const url = path + 'data';
    return await AxiosClient.post(url, {
      data: JSON.stringify(data),
    });
  },
  GET: async () => {
    const url = path + 'data/grammar';
    return await AxiosClient.get(url);
  },
  PATCH: async (data: any) => {
    const url = path + 'data/grammar';
    return await AxiosClient.patch(url, {
      data: JSON.stringify(data),
    });
  },
};

export default GrammarApi;
