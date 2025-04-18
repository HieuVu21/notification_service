import winston from 'winston';
import {
  TransformedData,
  LogData,
  ElasticsearchTransformer,
  ElasticsearchTransport,
} from 'winston-elasticsearch';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
};

export const winstonLogger = (
  elasticsearchNode: string,
  name: string,
  level: string
) => {
  const consoleTransport = new winston.transports.Console({
    level,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  });

  const esTransport: ElasticsearchTransport = new ElasticsearchTransport({
    level,
    transformer: esTransformer,
    clientOpts: {
      node: elasticsearchNode,
      maxRetries: 2,
      requestTimeout: 10000,
      sniffOnStart: false,
    },
  });

  const logger  = winston.createLogger({
    exitOnError: false,
    defaultMeta: {
      service: name,
    },
    transports: [consoleTransport, esTransport],
  });

  return logger;
};
