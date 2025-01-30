import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [], // Ensure nothing is wrongly externalized
    }
  },
  optimizeDeps: {
    include: ["@supabase/supabase-js"]
  }
});
