import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/client";
import customTheme from "../lib/theme";
import Auth from "./signin";
import Home from "./index";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const user = supabaseClient.auth.user();
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabaseClient.auth.session());

    supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (_event === "SIGNED_OUT") {
          console.log("signout")
          router.push("/signin");
        }
      }
    );

  }, []);

  return (
    <ChakraProvider theme={customTheme}>  <Component {...pageProps} >
      {!session ? <Auth /> : <Home key={session.user.id} session={session} />}</Component>
    </ChakraProvider>
  );
}

export default MyApp;