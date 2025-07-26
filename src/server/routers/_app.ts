import { router } from '../trpc';
import { modelsRouter } from './model';

export const appRouter = router({
    models: modelsRouter,
});

export type AppRouter = typeof appRouter;