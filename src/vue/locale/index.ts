import {createI18n, I18n} from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'


let i18n: I18n;

const createI18nInstance = (locale: string) => {
    i18n = createI18n({
        globalInjection: true,
        locale,
        fallbackLocale: 'zh',
        messages: {
            zh,
            en,
        },
    })
    return i18n
}

const setLocale = (locale: string) => {
    if (i18n) {
        i18n.global.locale = locale
    }
}

export {createI18nInstance, setLocale}
