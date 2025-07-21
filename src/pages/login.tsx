import React from "react";
import Image from "next/image";
import styles from "@/styles/pages/login.module.scss";
import { getProviders, getSession, signIn } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import Page from "@/components/Page";

interface LoginProps {
  providers: {
    [key: string]: {
      id: string;
    };
  };
}

export default function Login({ providers }: LoginProps) {
  return (
    <Page className={styles.login}>
      <div className={styles.login__title}>
        <h1>.blendify</h1>
      </div>
      <div className={styles.login__action}>
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
    </Page>
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
