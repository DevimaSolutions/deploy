import axios from 'axios';
const NODE_VERSION_URL = 'https://nodejs.org/dist/index.json';

interface INodeResponse {
  version: string;
  date: Date;
  files: string[];
  npm: string;
  v8: string;
  uv: string;
  zlib: string;
  openssl: string;
  modules: string;
  lts: boolean;
  security: boolean;
}

const getLatestLtsVersion = async () => {
  const nodeVersionsList = await axios.get<INodeResponse[]>(NODE_VERSION_URL);

  const version = nodeVersionsList.data
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .find((item) => item.lts);

  return version as INodeResponse;
};

const nodeUtil = { getLatestLtsVersion };

export default nodeUtil;
