/**
 * AntGravity Studio — Logger & Performance Monitor
 */

class LoggerService {
  constructor() {
    this.logs = [];
    this.metrics = {};
  }

  log(message, context = {}) {
    const entry = { timestamp: new Date().toISOString(), level: 'INFO', message, context };
    this.logs.push(entry);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, context);
    }
  }

  error(message, error = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      stack: error?.stack || error?.message || error,
    };
    this.logs.push(entry);
    console.error(`[ERROR] ${message}`, error);
  }

  startMetric(metricName) {
    this.metrics[metricName] = performance.now();
  }

  endMetric(metricName) {
    if (this.metrics[metricName]) {
      const duration = performance.now() - this.metrics[metricName];
      this.log(`Metric: ${metricName}`, { durationMs: duration.toFixed(2) });
      delete this.metrics[metricName];
      return duration;
    }
    return 0;
  }

  getLogs() {
    return this.logs;
  }
}

export const logger = new LoggerService();
export default logger;
