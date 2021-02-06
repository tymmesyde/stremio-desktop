<template>
    <div class="heading">
        <img class="logo" alt="Stremio logo" src="./assets/img/logo.png">
        <h1>Stremio Desktop</h1>
    </div>

    <Loading v-show="loading"/>

    <div class="options" v-show="!loading">
        <Button icon="rocket" :disabled="isReleaseSelected" @click="launch()" v-if="installedVersion == release">Launch</Button>
        <Button icon="arrow-down-circle" :disabled="isReleaseSelected" @click="install()" v-else>Install</Button>
        
        <select v-model="release">
            <option :value="release.name" v-for="release in releases" :key="release.name">
                {{ release.name }}
            </option>
        </select>

        <Toggle v-model="useServer" text="Use built-in streaming server"></Toggle>
    </div>
</template>

<script>
import Loading from './components/Loading.vue';
import Toggle from './components/Toggle.vue';
import Button from './components/Button.vue';
import launcher from './services/launcher';

export default {
    name: 'App',
    components: {
        Loading,
        Toggle,
        Button
    },  
    data() {
        return {
            loading: true,
            serverUrl: '',
            installedVersion: null,
            release: '',
            releases: [],
            useServer: true
        }
    },
    computed: {
        isReleaseSelected() {
            return this.release ? false : true;
        }
    },
    methods: {
        async init() {
            this.installedVersion = await launcher.getInstalledVersion();
            this.releases = await launcher.getReleases();
            this.release = this.installedVersion;

            this.loading = false;
        },
        async install() {
            this.loading = true;

            const release = this.releases.find(({ name }) => name === this.release);
            await launcher.installRelease(release);
            this.installedVersion = await launcher.getInstalledVersion();

            this.loading = false;
        },
        async launch() {
            this.loading = true;

            if (this.useServer) await launcher.startServer();
            await launcher.launchStremio();

            this.loading = false;
        }
    },
    mounted() {
        this.init();
    }
}
</script>

<style lang="scss">
@import './main.scss';

#app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
    height: 100%;
    user-select: none;

    .heading {
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
        justify-content: center;

        .logo {
            width: 150px;
        }
    }
    
    .options {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 15px;
    }
}
</style>
