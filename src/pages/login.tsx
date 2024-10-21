import React from "react";
import Image from "next/image";
import styles from "@/styles/pages/login.module.scss";
import { getProviders, signIn } from "next-auth/react";

interface LoginProps {
  providers: {
    [key: string]: {
      id: string;
    };
  };
}

export default function Login({ providers }: LoginProps) {
  return (
    <div className={styles.login}>
      <div className={styles.login__signIn}>
        <h1>blendify</h1>
      </div>
      <button
        onClick={() => signIn(providers?.spotify?.id, { callbackUrl: "/" })}
      >
        sign in w/ spotify
        <Image
          src="/img/spotify-icon-white.png"
          alt="spotify-logo"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
