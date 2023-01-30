import { useEffect, useState } from "react";
import Head from "next/head";

const Header = ({ slug }) => {
    return (
        <Head>
            <title>RVMS - {slug}</title>
            <meta
                name="description"
                content="Your best resident and visitor management system"
            />
            <link rel="icon" href="/favicon.png" />
        </Head>
    );
}

export default Header;