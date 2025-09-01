import { Gateway } from '@webnodex/gateway';

const config = {
  port: parseInt(process.env.PORT || '3000'),
};

const webnodex = new Gateway(config);

webnodex.start();
