// Export the main axios client and utilities
export { default as apiClient, apiUtils } from './client';

// Export auth API
export * from './auth';

// Export types
export type { AxiosRequestConfig, AxiosResponse } from './client';

// Future APIs can be exported here:
// export * from './user';
// export * from './transactions';
// export * from './chat'; 