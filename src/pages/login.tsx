import React from "react";
import Image from "next/image";
import styles from "./login.module.scss";
import { getProviders, getSession, signIn } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

interface LoginProps {
  providers: {
    [key: string]: {
      id: string;
    };
  };
}

export default function Login({ providers }: LoginProps) {
  return (
    <main className={styles.login}>
      <div className={styles.login__card}>
        <h1 className={styles.login__wordmark}>.blendify</h1>
        <div className={styles.login__cassette}>
          <Image src="/img/cassette.jpg" alt="cassette tape" fill priority />
        </div>
        <p className={styles.login__descriptor}>your music taste, in full.</p>
        <button
          className={styles.login__cta}
          onClick={() => signIn(providers?.spotify?.id, { callbackUrl: "/" })}
        >
          sign in w/ spotify
          <Image
            src="/img/spotify-icon-white.png"
            alt=""
            width={18}
            height={18}
            aria-hidden
          />
        </button>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
