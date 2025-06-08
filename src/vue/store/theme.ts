import {defineStore} from 'pinia'

interface ThemeState {
    ThemeMod: string
    ThemeColor: string
    language: string
}

export const useThemeStore = defineStore('theme', {
    state: (): ThemeState => ({
        ThemeMod: 'Md2亮色',
        ThemeColor: '',
        language: 'zh',
    }),

    actions: {
        setThemeMod(data: string) {
            this.ThemeMod = data
        },
        setThemeColor(data: string) {
            this.ThemeColor = data
        },
        setLanguage(data: string) {
            this.language = data
        },
    },

    persist: {
        key: 'ThemeData',
    },
})
