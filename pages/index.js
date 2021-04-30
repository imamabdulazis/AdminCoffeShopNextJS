import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Admin from './components/layer/admin'
import Auth from './components/layer/Auth'

export default function Home() {
  return (
    <div className={styles.container}>

    </div>
  )
}


Home.layout = Admin