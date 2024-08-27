import { verifyEmail } from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { Spinner } from "@nextui-org/react";
import { MdOutlineMailOutline } from "react-icons/md";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const result = await verifyEmail(searchParams.token);

  return (
    <CardWrapper
      headerText="Verifying Your Email Address"
      headerIcon={MdOutlineMailOutline}
      body={
        <div className="flex flex-col space-y-4 items-center">
          <div className="flex flex-row items-center">
            <p>
              Verifying Your Email Address
              <span className="text-warning italic">...PLEASE WAIT...</span>
            </p>
            {!result && <Spinner color="warning" />}
          </div>
        </div>
      }
      footer={<ResultMessage result={result} />}
    />
  );
}
