import { auth } from "@/auth";
import ClientSession from "@/components/ClientSession";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-row justify-around mt-20 gap-6">
      <div className="bg-green-50 p-5 rounded-xl shadow-md w-1/2 overflow-auto">
        <h3 className="text-2xl font-semibold">
          Server Session Data {"  "} :{" "}
        </h3>
        {session ? (
          <div>
            <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
          </div>
        ) : (
          <div>Not Signed In</div>
        )}
      </div>
      <ClientSession />
    </div>
  );
}
