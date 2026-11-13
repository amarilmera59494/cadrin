import {defineConfig} from 'cf/config';
export default defineConfig({worker:{name:'cadrin',compatibilityDate:'2026-11-12',workersDev:true,assets:{htmlHandling:'force-trailing-slash',notFoundHandling:'404-page'},observability:{enabled:false}}});
