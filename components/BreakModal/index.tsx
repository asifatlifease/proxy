import { ITodayDetail } from "@/app/page";
import { getDate, getTime } from "@/utils/timeUtils";
import React, { useEffect, useState } from "react";

interface IBreakModalProps {
  employeesDetails: ITodayDetail[];
  currentId: string;
}

function BreakModal({ employeesDetails, currentId }: IBreakModalProps) {
  const [employeeDetails, setEmployeeDetails] = useState<any>();

  function handleSetBreaks() {
    const currentEmployeeDetails = employeesDetails.find(
      (employee) => employee.id === currentId
    );
    setEmployeeDetails(currentEmployeeDetails);
  }

  useEffect(() => {
    handleSetBreaks();
  }, [currentId]);

  return (
    <div>
      <p>Date: {getDate(employeeDetails?.checkin)}</p>
      <div className="flex items-center p-2 justify-between rounded-md border">
        <p>
          <span className="text-blue-500 font-bold">Checkin :</span>{" "}
          {getTime(employeeDetails?.checkin)}
        </p>
        <p>
          <span className="text-red-500 font-bold">Checkout :</span>{" "}
          {getTime(employeeDetails?.checkout)}
        </p>
      </div>

      <div>
        {employeeDetails?.breaks?.map((breakItem: any) => (
          <div key={JSON.stringify(breakItem)}>
            {Object.keys(breakItem).map((item) => (
              <div key={JSON.stringify(item)} className="p-1 rounded-md border my-1">
                {item === "startTime" ? (
                  <p>Start :{getTime(breakItem[item])}</p>
                ) : (
                  <p>End : {getTime(breakItem[item])}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BreakModal;
