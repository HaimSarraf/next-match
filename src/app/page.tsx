import { auth, signOut } from "@/auth";
import { Button } from "@nextui-org/react";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-y-20">
      <div className="flex flex-col text-center">
        <h1 className="font-bold text-3xl text-gray-400 bg-yellow-50  p-2 w-full">
          TXTMessenge-Web-App
        </h1>
        <p className="bg-yellow-100 rounded text-gray-300 text-sm">
          Presented by :{" "}
          <text className="font-bold italic text-orange-300 text-medium">
            Haim Sarraf
          </text>
        </p>
      </div>

      <h3 className="text-2xl font-semibold">User Session Data {"  "} : </h3>

      {session ? (
        <div>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <form
            className="justify-center"
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button type="submit" color="danger" variant="bordered">
              Sign Out
            </Button>
          </form>
        </div>
      ) : (
        <div>Not Signed In</div>
      )}
    </div>
  );
}
