import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Admin from './components/layouts/Admin.js'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      router.replace('/admin/dashboard')
    } else {
      router.replace('/admin/login')
    }
  }, []);


  return (
    <div>

    </div>
  )
}
