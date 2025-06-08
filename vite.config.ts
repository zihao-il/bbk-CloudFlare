import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {cloudflare} from "@cloudflare/vite-plugin";
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import {VarletImportResolver} from '@varlet/import-resolver'
import viteCompression from "vite-plugin-compression2";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(),
        cloudflare(),
        viteCompression(),
        components({
            resolvers: [VarletImportResolver()]
        }),
        autoImport({
            resolvers: [VarletImportResolver({autoImport: true})]
        })
    ],
})
