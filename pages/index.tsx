import type { NextPage } from 'next';
import { AuthContext } from '../context/AuthContext';
import { FormEvent, useContext, useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

  const [email, setEmail] = useState('');
  const [pw, setPw]= useState('');

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      pw
    }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
      <input type="password"  value={pw} onChange={(e) => { setPw(e.target.value) }}/>
      <button type='submit'>SignIn</button>
    </form>
  )
}

export default Home
