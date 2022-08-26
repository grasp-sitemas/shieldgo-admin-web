<template>
    <div id="app">
        <Header />
        <LeftSideBar />
        <router-view />
        <Footer />
    </div>
</template>
<script>
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer'
import LeftSideBar from './components/layout/LeftSideBar/LeftSideBar'
export default {
    name: 'app',
    components: {
        Header,
        LeftSideBar,
        Footer,
    },
}
</script>

<style>
</style>
