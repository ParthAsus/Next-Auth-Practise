"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
// import {auth, signOut} from "@/auth";  // servere
import {signOut } from "next-auth/react";

const SettingsPage = () => {
  // const session = await auth(); // in server component
  const user = useCurrentUser();

  const onClick = () => {
    signOut();
  };
  return (
    <div className="bg-white p-10 rounded-xl">
      {/* {JSON.stringify(session)} */}
      <button type="submit" onClick={onClick}>
        Sign Out
      </button>
    </div>

    // ----------------------------------
    // usign serever component
    // <div>
    //   {JSON.stringify(session)}

    //   <form action={async () => {
    //     "use server";

    //     // await signOut();
    //   }}>
    //     <button type="submit">
    //       Sign Out
    //     </button>
    //   </form>
    // </div>
  );
};

export default SettingsPage;
