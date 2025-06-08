import {defineStore} from 'pinia'

interface VersionState {
    isBeta: string
    Release: string
    Beta: string
    version: string
}

export const useVersionStore = defineStore("version", {
    state: (): VersionState => ({
        isBeta: '',
        Release: '',
        Beta: '',
        version: '',
    }),

    actions: {
        setIsBeta(data: string) {
            this.isBeta = data
        },
        setRelease(data: string) {
            this.Release = data
        },
        setBeta(data: string) {
            this.Beta = data
        },
        setVersion(data: string) {
            this.version = data
        },
    },

    persist: {
        key: 'TempData',
        storage: sessionStorage,
    },
})
