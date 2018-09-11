export const startPolling = (pollingInterval, func, ...args) => {
  func(...args);

  if (pollingInterval <= 0) {
    return null;
  }

  return setInterval(() => { func(...args); }, pollingInterval);
};

export const stopPolling = (timer) => {
  clearInterval(timer);
};
