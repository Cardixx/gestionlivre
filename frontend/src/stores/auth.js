// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('authToken'))
    const userRole = ref(localStorage.getItem('userRole'))

    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => userRole.value === 'admin')

    function initializeFromStorage() {
        token.value = localStorage.getItem('authToken')
        userRole.value = localStorage.getItem('userRole')
    }

    function login(authData) {
        token.value = authData.token
        userRole.value = authData.role
        localStorage.setItem('authToken', authData.token)
        localStorage.setItem('userRole', authData.role)
        router.push('/accueil')
    }

    function logout() {
        token.value = null
        userRole.value = null
        localStorage.removeItem('authToken')
        localStorage.removeItem('userRole')
        router.push('/login')
    }

    return {
        token,
        userRole,
        isAuthenticated,
        isAdmin,
        initializeFromStorage,
        login,
        logout
    }
})