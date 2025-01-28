import React, { useEffect, useState } from "react";
import Navbar from "../components/input/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";
const Home = () => {
  const navigate = useNavigate();

  const [userinfo, setuserinfo] = useState(null);
  const [allstories, setallstories] = useState([]);

  // get user info for the dahsboard
  const getuserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        // set user info if user exists
        setuserinfo(response.data.user);
      }
    } catch (error) {
      if (error.response.staus === 401) {
        // clear storage if unauthorised
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  // get all travel stories
  const getalltravelstories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setallstories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occured");
    }
  };

  useEffect(() => {
    getuserInfo();
    getalltravelstories();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userinfo={userinfo} />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allstories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allstories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageurl}
                      title={item.title}
                      story={item.story}
                      date={item.visiteddate}
                      visitedLocation={item.visitedlocation}
                      isFavourite={item.isfavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <div>tata</div>
            )}
          </div>
          <div className="w-[320px]"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
