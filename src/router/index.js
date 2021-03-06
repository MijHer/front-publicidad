import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index.js'
import HomeView from '../views/HomeView.vue'
import App from '../App.vue'
import LoginView from '../views/auth/LoginView.vue'
import CategoriaView from '../views/admin/categoria/CategoriaView.vue'
import PublicacionView from '../views/admin/publicacion/PublicacionView.vue'
import RubroView from '../views/admin/rubro/RubroView.vue'
import EmpresaView from '../views/admin/empresa/EmpresaView.vue'
const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: App,
    meta: {requireAuth: true},
    children: [
      {
        path: 'categoria',
        name: 'Categoria',
        component: CategoriaView
      },
      {
        path: 'publicacion',
        name: 'Publicacion',
        component: PublicacionView
      },
      {
        path: 'rubro',
        name: 'Rubro',
        component: RubroView
      },
      {
        path: 'empresa',
        name: 'Empresa',
        component: EmpresaView
      }
    ]
  },
  {
    path: '/ingresar',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.meta.requireAuth)
  {
    if(store.getters.estaAutenticado != null)
    {
      next()
    }
    next("/ingresar")
  }
 next()
});

export default router
