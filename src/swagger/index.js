import dotenv from 'dotenv';
import { welcome } from './welcome.swagger';
import { manualSignup } from './manualSignup.swagger';

import { resetPassword } from './passwordReset.swagger';
import { assignUsers } from './assignUsers.swagger';
import { logout } from './userLogout.swagger';

dotenv.config();
const paths = {
  ...welcome, ...manualSignup, ...resetPassword, ...logout, ...assignUsers,
};
const config = {
  swagger: '2.0',
  info: {
    description: '',
    version: '1.0.0',
    title: 'Online Ticketing and Live streaming System',
  },
  host: process.env.HOST.replace('http://', '') || process.env.HOST.replace('https://', ''),
  basePath: '/',
  schemes: [
    'http',
    'https',
  ],
  paths,
};
export default config;
