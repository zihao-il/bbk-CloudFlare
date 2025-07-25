<script lang="ts" setup>
import {get_version, search_version} from "../api";
import {onMounted, reactive, ref} from "vue";
import {ActionSheet, Snackbar} from "@varlet/ui";
import {useVersionStore} from "../store/version.js";
import {useI18n} from 'vue-i18n';

const store = useVersionStore()
const {t} = useI18n();


interface McItem {
    version: string
    version_all?: string
    is_beta?: number
    update_time?: string
    file_size?: string
    link: string | Record<string, any>
}

const mcList = reactive<McItem[]>([])
const newMcList = reactive<McItem[]>([])
const searchValue = ref<string>("")
const mSearch = ref<boolean>(true)
const loading = ref<boolean>(false)
const finished = ref<boolean>(false)
const isBeta = ref<string | number>(0)
const newCard = ref<string>("")
const errorPop = ref<boolean>(false)
const skeletonLoading = ref<boolean>(true)
const show = ref<boolean>(true)
const NewRelease = ref<string>("")
const NewBeta = ref<string>("")

async function getMcData(d: any, b = false, s = false): Promise<void> {
    let vData: McItem[] = []

    if (s) {
        const {data} = await search_version(d)
        if (data.status === 201) {
            Snackbar.error(t("language.no_version"))
            return
        }
        vData = data.message
    } else {
        try {
            const {data} = await get_version(d)
            vData = data.message
        } catch (e) {
            errorPop.value = true
            loading.value = false
            finished.value = true
            return
        }
    }

    if (b) {
        mcList.splice(0, mcList.length, ...vData)
    } else {
        mcList.push(...vData)
    }
}


const Init = (): void => {
    switch (isBeta.value) {
        case "全版本":
        case 0:
            store.setVersion(store.Beta)
            break
        case "正式版":
        case 1:
            store.setVersion(store.Release)
            break
        case "测试版":
        case 2:
            store.setVersion(store.Beta)
            break
    }
}

async function getLastData(): Promise<void> {
    const {data} = await get_version({v: "larversion"})
    if (data.status === 201) {
        Snackbar.error(t("language.fail_version"))
        return
    }
    const vData = data.message
    store.setIsBeta("")
    store.setRelease(vData[0].Release)
    store.setBeta(vData[0].Beta)
    skeletonLoading.value = false
}


async function getNewMcList(): Promise<void> {
    const {data} = await get_version({v: "last"})
    newMcList.splice(0, mcList.length, ...data.message)
    for (const li of newMcList) {
        if (li.is_beta === 0) {
            NewRelease.value = t("language.latest_release", {version: li.version})
        } else {
            NewBeta.value = t("language.latest_beta", {version: li.version})
        }
    }
}

onMounted(() => {
    getLastData()
    getNewMcList()
    let intervalId = setInterval(function () {
        let betaValue = store.Beta;
        if (betaValue !== "") {
            clearInterval(intervalId);
            getMcData({"v": betaValue});
            store.setVersion(betaValue)
        }
    }, 100);
    window.scrollTo(0, 0);
});


function mSwitch(): void {
    mSearch.value = !mSearch.value
}

function searchInput(): void {
    let m: string | undefined
    let b: string | undefined

    switch (isBeta.value) {
        case "全版本":
            b = "2"
            break
        case "正式版":
            b = "0"
            break
        case "测试版":
            b = "1"
            break
    }

    if (searchValue.value !== "") {
        if (searchValue.value.split(".")[1]) {
            m = mSearch.value ? "1" : "0"
            newCard.value = "new-card"
            getMcData({s: searchValue.value, m, b}, true, true)
            loading.value = false
            finished.value = true
        }
    } else {
        newCard.value = ""
        Init()
        getMcData({v: store.version, b}, true, false)
        loading.value = true
        finished.value = false
        load()
    }
}

function setItem(B: string, D: "Beta" | "Release"): void {
    const v = D === "Beta" ? store.Beta : store.Release
    store.setIsBeta(B)
    getMcData({v, b: B}, true)
    store.setVersion(v)
}

function handleClick(isBeta: string): void {
    searchValue.value = ""
    store.setVersion(store.Beta)
    switch (isBeta) {
        case "全版本":
            setItem("", "Beta")
            break
        case "正式版":
            setItem("0", "Release")
            break
        case "测试版":
            setItem("1", "Beta")
            break
    }
}

function load(): void {
    setTimeout(() => {
        const is_b = store.isBeta
        const ver = store.version
        if (ver === "1.2.x") {
            loading.value = false
            finished.value = true
            return
        }

        let v = parseInt(ver.split(".")[1]) - 1
        if (isNaN(v)) {
            Snackbar.error(t("language.fail_request"))
            return
        }
        const newVer = `1.${v}.x`
        store.setVersion(newVer)

        const d = is_b === "" ? {v: newVer} : {v: newVer, b: is_b}
        getMcData(d)
        loading.value = false
    }, 1000)
}

const generateLink = (version: string): string => {
    const versionParts = version.split(".")
    const ver = `${versionParts[0]}.${versionParts[1]}`
    return ver > "1.1"
        ? t("language.wiki_be", {version})
        : t("language.wiki_pe", {version})
}

async function createSheet(li: McItem, vv: string): Promise<void> {
    let d: Record<string, any>

    try {
        d = typeof li.link === "string" ? JSON.parse(li.link) : li.link
    } catch {
        d = {}
    }

    // if (d["OneDrive_365"]) {
    //     delete d["OneDrive_365"]
    // }

    const keys = Object.keys(d);
    keys.reverse();
    const transformedKeys = keys.map(key => {
        return {
            name: key,
            icon: 'download'
        };
    });

    const action = await ActionSheet({
        actions: transformedKeys,
        title: t("language.download_rec"),
    })

    if (action !== "close") {
        const data = d[action.name]
        if (vv === "v7") {
            window.open(data.ARMv7, "_blank")
        } else {
            if (!data.ARMv8) {
                Snackbar.warning(t("language.no_armv8"))
            } else {
                window.open(data.ARMv8, "_blank")
            }
        }
    }
}

const convertUTCDateToLocalDate = (utcDateString: string | null): string => {
    if (!utcDateString) {
        return t("language.undetermined_time")
    }
    const date = new Date(utcDateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
}

</script>

<template>

    <var-tabs v-model:active="isBeta" @click="handleClick">
        <var-tab name="全版本">{{ $t('language.all') }}</var-tab>
        <var-tab name="正式版">{{ $t('language.release') }}</var-tab>
        <var-tab name="测试版">{{ $t('language.beta') }}</var-tab>

    </var-tabs>


    <var-row justify="center">
        <var-col :span="22">
            <var-input v-model="searchValue" :placeholder="$t('language.search')" variant="outlined"
                       @input="searchInput"/>
            <var-checkbox v-model="mSearch" class="mSwitch" @click="mSwitch">{{
                    $t('language.fuzzy_search')
                }}
            </var-checkbox>
        </var-col>

        <var-list v-model:loading="loading"
                  :error-text="$t('language.t_error')"
                  :finished="finished"
                  :finished-text="$t('language.t_finished')"
                  :loading-text="$t('language.t_loading')"
                  check
                  offset="30"
                  @load="load">

            <var-skeleton
                :loading="skeletonLoading"
                :rows="3"
                card
                title
            >

                <var-col v-for="li in mcList" :key="li.version_all">
                    <var-card
                        :class="li.is_beta === 0 ? 'card-R' : 'card-B'"
                        :subtitle="li.is_beta===0 ? t('language.release') : t('language.beta')"
                        :title=li.version
                        layout="column"
                        ripple
                        variant="outlined"
                    >
                        <template #description>
                            <var-space>
                                <ul>
                                    <li>{{ $t('language.change_log') }}

                                        <var-link target="_blank" type="primary"
                                                  underline="none"
                                                  v-bind:href="generateLink(li.version)">Minecraft Wiki
                                        </var-link>
                                    </li>
                                    <li>
                                        {{ $t('language.update_time') }}{{ convertUTCDateToLocalDate(li.update_time) }}

                                    </li>
                                    <li>
                                        {{ $t('language.file_size') }}{{ li.file_size }}

                                    </li>
                                </ul>
                            </var-space>

                        </template>

                        <template #extra>
                            <var-space>
                                <var-chip plain type="primary" @click="createSheet(li,'v7')">
                                    ARMv7
                                    <template #right>
                                        <var-icon name="download"/>
                                    </template>

                                </var-chip>

                                <var-chip plain type="primary" @click="createSheet(li,'v8')">
                                    ARMv8
                                    <template #right>
                                        <var-icon name="download"/>
                                    </template>
                                </var-chip>

                            </var-space>
                        </template>
                    </var-card>
                </var-col>
            </var-skeleton>

        </var-list>
        <var-col justify="center">
            <div>
                by：
                <var-link href="https://github.com/zihao-il" target="_blank" type="primary"
                          underline="none">zihao_il
                </var-link>
            </div>
        </var-col>
        <var-back-top :duration="300"/>
    </var-row>
    <var-popup v-model:show="errorPop" :default-style="false">
        <var-result :title="$t('language.unable_version')" class="result" type="empty">
            <template #description>
                <p>{{ $t('language.fix_web') }}</p>
            </template>
            <template #footer>
                <var-button
                    color="var(--result-empty-color)"
                    text-color="#fff"
                    @click="errorPop = false">
                    {{ $t('language.know') }}
                </var-button>

            </template>
        </var-result>
    </var-popup>


    <var-snackbar v-model:show="show" :vertical="true" type="danger">
        <div>
            <h3>{{ $t('language.support_genuine') }}</h3>
            <p>{{ $t('language.del_packages') }}</p>
            <p>{{ $t('language.get_genuine') }}</p>

            <p>{{ NewRelease }}</p>
            <p>{{ NewBeta }}</p>

        </div>

        <template #action>

            <var-link href="https://www.minecraft.net/" type="primary">
                <var-button size="small" type="primary">{{ $t('language.mc_website') }}</var-button>
            </var-link>


        </template>
    </var-snackbar>

</template>

<style scoped>
.var-input {
    width: 100%;
    margin-top: 1.25em;
    margin-bottom: 1.25em;
}

.var-card {
    margin-bottom: 1.25em;
}

.var-row {
    padding-bottom: 50px;
}


.var-list {
    width: 92%;

    min-height: 100vh;
}


ul {
    margin-top: 0.75em;
    margin-left: 2em;
    list-style-type: disc;

}

.mSwitch {
    margin-top: 25px;
    margin-left: 10px;
}

.new-card {
    display: none !important;
}

.b-radius {
    border-radius: 10px;
}

.var-skeleton {
    position: relative;
    z-index: 0;
}

</style>