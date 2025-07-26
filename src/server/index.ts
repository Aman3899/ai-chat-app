import { router } from './trpc';
import { modelsRouter } from './routers/model';

export const appRouter = router({
    models: modelsRouter,
});