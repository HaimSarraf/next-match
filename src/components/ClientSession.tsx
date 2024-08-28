"use client";

import { useSession } from "next-auth/react";

function ClientSession() {
  const session = useSession();
  return (
    <div className="bg-blue-50 p-5 rounded-xl shadow-md w-1/2 overflow-auto">
      <h3 className="text-2xl font-semibold">Client Session Data {"  "} : </h3>
      {session ? (
        <div>
          <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
        </div>
      ) : (
        <div>Not Signed In</div>
      )}
    </div>
  );
}
export default ClientSession;
