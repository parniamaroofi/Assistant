<template>
    <div class="container">
        <nav>
                <a href="#" data-target='mobile-demo' class="sidenav-trigger"><i class="material-icons">menu</i></a>
                <ul class="hide-on-med-and-down">
                    <li class="waves-effect"><nuxt-link to="/"><i class="material-icons left">home</i><span>Home</span></nuxt-link></li>
                    <li class="waves-effect"><nuxt-link to="/note"><i class="material-icons left">create</i><span>Note</span></nuxt-link></li>
                    <li class="waves-effect"><nuxt-link to="/chat"><i class="material-icons left">chat</i><span>Chat</span></nuxt-link></li>
                </ul>
                <ul class="sidenav" id="mobile-demo">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Note</a></li>
                    <li><a href="#">Chat</a></li>
                </ul>
        </nav> 
    </div>
</template>

<script>

export default {
    mounted() {
        document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems);
        })
    }
}
</script>

<style scoped>
nav{
    background-color: #6d82a8 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

nav ul li{
    margin:0 35px 0 35px;
}

nav ul li i{
    padding-top:3px;
}

nav ul li span{
    margin-left: -10px;
}

.sidenav-trigger{
    position:absolute;
    left:10px;
}

</style>