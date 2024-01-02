import React, { useState } from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom"

import { getEventTypesAPI, setIntrestAPI } from "../apis";

const selectedClasses = "text-white bg-green-600 border-green-600";
const notSelectedClasses = "text-green-900 bg-green-100 border-green-300";

const SelectInterest = () => {
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const { data, error, isLoading } = useSWR("eventTypes", getEventTypesAPI);
  const navigate = useNavigate();
  const getClassName = (typeId) => {
    return selectedEventTypes.includes(typeId)
      ? selectedClasses
      : notSelectedClasses;
  };

  const handleClick = (typeId) => {
    setSelectedEventTypes((prev) => {
      const oldState = [...prev];

      if (oldState.includes(typeId)) {
        return oldState.filter((v) => v !== typeId);
      }

      oldState.push(typeId);

      return oldState;
    });
  };

  const handleSave = async () =>{
    try{
      setIsSaving(true);
      await setIntrestAPI(selectedEventTypes);
      navigate("/")
    }catch(e){
      if(e.response?.data?.message){
        alert(e.response.data.message);
        return;
      }
      alert("Something went wrong!");
    }finally{
      setIsSaving(false);    
    }
  }

  return (
    <>
      <div className="w-100 h-screen flex justify-center items-center">
        <div className="min-w-60 h-60">
          <h1 className="text-3xl py-2">
            Select The Events You Are Intereted In.
          </h1>
          <div className="p-3 flex justify-center gap-1 max-w-60">
            {data && data?.length
              ? data.map((v) => (
                  <div
                    key={v._id}
                    className={
                      "rounded-full py-1 px-4 font-medium border cursor-pointer capitalize" +
                      getClassName(v._id)
                    }
                    onClick={handleClick.bind(null, v._id)}
                  >
                    {v.title.replaceAll("_", " ")}
                  </div>
                ))
              : null}
          </div>
          <button
            onClick={handleSave}
            className="p-10 bg-red-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
            disabled={isLoading || isSaving}
          >
            {isLoading || isSaving ? "Loading..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
};

export default SelectInterest;
