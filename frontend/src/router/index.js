import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Room from '../views/Room.vue'
import Post from '../views/Post.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Main
  },
  {
    path: '/room',
    name: 'Room',
    component: Room
  },
  {
    path: '/post',
    name: 'Post',
    component: Post
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
