import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Ratings from "../components/Ratings";
import { useToken } from "../contexts/TokenContext";
import handleClassLeave from "../features/classes/handleClassLeave";
import handleClassSignUp from "../features/classes/handleClassSignUp";
import handleRate from "../features/classes/handleRate";
import useAsset from "../hooks/useAsset";
import useClass from "../hooks/useClass";
import useRatings from "../hooks/useRatings";
import useUser from "../hooks/useUser";
import { apiUrl } from "../utils/apiUrl";

function ClassDetails() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { token } = useToken();
  const { gymClass, error, isPending } = useClass();
  const { asset } = useAsset(gymClass?.trainer.assetId);
  const { ratings, mutateRatings } = useRatings(gymClass?.id);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isAlreadySignedUpForClassDay, setIsAlreadySignedUpForClassDay] =
    useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [showRateOptions, setShowRateOptions] = useState(false);

  if (!gymClass && !isPending) {
    navigate("/404");
  }

  const titleSize =
    gymClass?.className.length > 20 && user
      ? "text-medium leading-10"
      : "text-large leading-[4rem]";

  useEffect(() => {
    if (!user) return;

    setIsSignedUp(
      user.classes.some((userClass) => userClass?.id === gymClass?.id)
    );

    setIsAlreadySignedUpForClassDay(
      user.classes?.some(
        (userClass) =>
          userClass?.classDay === gymClass?.classDay &&
          userClass?.id !== gymClass?.id
      )
    );
  }, [user, gymClass]);

  useEffect(() => {
    setHasRated(ratings?.some((rating) => rating?.userId === user?.id));
  }, [ratings, user, gymClass]);

  return (
    <div className="h-full">
      {error && <p>{error}</p>}
      {isPending && <p>Loading...</p>}
      {gymClass && (
        <>
          <div className="grid grid-rows-1 grid-cols-1 h-1/2">
            <img
              className="row-span-full col-span-full h-full w-full object-cover"
              src={`${apiUrl}${gymClass.asset.url}`}
              alt={`${gymClass.className} workout class`}
              title={`${gymClass.className} workout class`}
            />
            <Navigation
              className="row-span-full col-span-full py-7 px-6 bg-black bg-opacity-30 h-fit"
              goBack
            />
            <div className="row-span-full col-span-full flex justify-between items-end pl-4 pb-4 h-fit place-self-end bg-black bg-opacity-30 w-full">
              <div className="pr-4 w-full max-w-[190px]">
                <p className={`${titleSize} text-white`}>
                  {gymClass.className}
                </p>
                <Ratings ratings={ratings} />
              </div>

              {user && token && (
                <button
                  className="button whitespace-nowrap"
                  onClick={() => {
                    if (!isSignedUp) {
                      if (isAlreadySignedUpForClassDay) {
                        setShowAlert(true);
                        setTimeout(() => {
                          setShowAlert(false);
                        }, 4000);
                        return;
                      }

                      handleClassSignUp(user.id, token.token, gymClass.id);
                      setIsSignedUp(true);
                    } else {
                      handleClassLeave(user.id, token.token, gymClass.id);
                      setIsSignedUp(false);
                    }
                  }}
                >
                  {isSignedUp ? "Leave" : "Sign up"}
                </button>
              )}
            </div>
          </div>
          <div className="relative h-1/2 px-6 py-4 flex flex-col gap-4">
            <div>
              {showAlert && isAlreadySignedUpForClassDay && (
                <p className="absolute top-0 right-1 text-red-600 text-xs ">
                  You are already signed up for a class on this day!
                </p>
              )}
              <p className="text-small">Schedule</p>
              <div className="flex justify-between">
                <p>{gymClass.classDay}</p>
                <p>{gymClass.classTime}</p>
              </div>
            </div>
            <p>{gymClass.classDescription}</p>
            {user && !hasRated && (
              <div className="flex gap-3">
                <button
                  className="bg-primary rounded-lg text-white px-2 py-2 tracking-widest text-sm"
                  onClick={(e) => {
                    setShowRateOptions(!showRateOptions);
                  }}
                >
                  Rate class
                </button>
                {showRateOptions && (
                  <ul
                    className="flex items-center gap-3 text-white text-sm"
                    onClick={async (e) => {
                      const rating = parseInt(e.target.innerText);
                      await handleRate(
                        user.id,
                        token.token,
                        gymClass.id,
                        rating
                      );
                      mutateRatings();
                      setHasRated(true);
                      setShowRateOptions(false);
                    }}
                  >
                    <li className="rounded-full bg-gray-400 w-8 h-8 flex items-center justify-center">
                      1
                    </li>
                    <li className="rounded-full bg-gray-400 w-8 h-8 flex items-center justify-center">
                      2
                    </li>
                    <li className="rounded-full bg-gray-400 w-8 h-8 flex items-center justify-center">
                      3
                    </li>
                    <li className="rounded-full bg-gray-400 w-8 h-8 flex items-center justify-center">
                      4
                    </li>
                    <li className="rounded-full bg-gray-400  w-8 h-8 flex items-center justify-center">
                      5
                    </li>
                  </ul>
                )}
              </div>
            )}
            <div>
              <p className="text-small">Trainer</p>
              <div className="flex gap-6">
                <img
                  className="h-24 w-20 object-cover rounded-lg"
                  src={
                    asset?.url
                      ? `${apiUrl}${asset?.url}`
                      : "data:image/jpeg;base64,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"
                  }
                  alt={gymClass.trainer.trainerName}
                  title={gymClass.trainer.trainerName}
                />
                <p>{gymClass.trainer.trainerName}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ClassDetails;
