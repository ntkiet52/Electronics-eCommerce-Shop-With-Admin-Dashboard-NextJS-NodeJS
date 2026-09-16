const config = {
  get apiBaseUrl() {
    const isServer = typeof window === 'undefined';
    if (isServer) {
      return (
        process.env.API_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        'http://localhost:3001'
      );
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  },
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default config;
