import { auth, signOut } from "@/auth";
import { Button } from "@nextui-org/react";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-y-20">
      

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
