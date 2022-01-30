import type { GetServerSideProps } from "next";
import { AuthContext } from "../context/AuthContext";
import { FormEvent, useContext, useState } from "react"

import { parseCookies } from "nookies";
import styles from "../styles/Home.module.css"

export default function Home() {

  const [email, setEmail] = useState("");
  const [password, setPw]= useState("");

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
      <input type="password"  value={password} onChange={(e) => { setPw(e.target.value) }}/>
      <button type="submit">SignIn</button>
    </form>
  )
}



export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);

  if (cookies['nextauth.token']) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: {
      
    }
  }
}