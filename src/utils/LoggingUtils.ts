export const LoggingUtils = {
  replaceLoggersWithDatestampPrepender(): void {
    const { ...loggers } = console;

    Object.entries(loggers).forEach(([key, logger]) => {
      console[key] = (...args) => {
        logger(`${new Date().toISOString()} -`, ...args);
      };
    });
  },
};
