import dynamic from "next/dynamic";
import Head from "next/head";

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function Home() {
    return (
        <>
            <Head>
                <title>Phaser Nextjs Template</title>
                <meta name="description" content="A Phaser 3 Next.js project template that demonstrates Next.js with React communication and uses Vite for bundling." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className='w-full h-full'>
                <AppWithoutSSR />
            </main>
        </>
    );
}
