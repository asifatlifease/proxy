"use client";

import BreakModal from "@/components/BreakModal";
import { auth } from "@/services/firebase";
import { AuthContext } from "@/shared/AuthProvider";
import { calculateHours, getDate, getTime } from "@/utils/timeUtils";
import { Button, Modal } from "antd";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface ITodayDetail {
  id: string;
  checkin: string | Date;
  checkout: string | Date;
  isOnBreak: boolean;
  breaks: any[];
  isCheckedIn: boolean;
}

function HomePage() {
  const router = useRouter();
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const { state, dispatch } = useContext(AuthContext);
  const [employeeDetails, setEmployeeDetails] = useState<ITodayDetail[]>([]);
  const [todayDetails, setTodayDetails] = useState<ITodayDetail>({
    id: "",
    checkin: "",
    checkout: "",
    isOnBreak: false,
    breaks: [],
    isCheckedIn: false,
  });
  const [currentId, setCurrentId] = useState<string>("");

  function handleCheckin() {
    const date = new Date();
    setTodayDetails((prev) => ({
      ...prev,
      id: uuidv4(),
      checkin: date,
      isCheckedIn: true,
    }));
  }

  function handleCheckout() {
    const id = todayDetails?.id;
    const modifiedEmpDetails = employeeDetails.map((emp) => {
      if (emp.id === id) {
        return {
          ...emp,
          checkout: new Date(),
          isCheckedin: false,
        };
      }
      return emp;
    });
    setEmployeeDetails(modifiedEmpDetails);
    setTodayDetails({
      id: "",
      checkin: "",
      checkout: "",
      isOnBreak: false,
      breaks: [],
      isCheckedIn: false,
    });
  }

  const handleStoreEmpDetails = React.useCallback(() => {
    if (todayDetails?.checkin) {
      setEmployeeDetails((prevDetails) => [...prevDetails, todayDetails]);
    }
  }, [todayDetails?.checkin]);

  React.useEffect(() => {
    handleStoreEmpDetails();
  }, [handleStoreEmpDetails]);

  function handleBreaks(e: any) {
    const date = new Date();
    let breakObj: any = {};

    if (!todayDetails?.isOnBreak) {
      breakObj.startTime = date;
    } else {
      breakObj.endTime = date;
    }

    setTodayDetails((prev: any) => ({
      ...prev,
      isOnBreak: e.target.checked,
      breaks: [...prev?.breaks, breakObj],
    }));

    const updatedDetails = employeeDetails.map((employee) => {
      if (employee.id === todayDetails?.id) {
        return {
          ...employee,
          breaks: [...employee.breaks, breakObj],
        };
      }

      return employee;
    });

    setEmployeeDetails(updatedDetails);
  }

  async function handleLogut() {
    try {
      await signOut(auth);
      dispatch({ type: "clear-user" });
      router.push("/login");
    } catch (error) {
      console.log("something went wrong!", error);
    }
  }

  return (
    <div className="container mx-auto">
      <Modal
        title="Breaks"
        open={isBreakModalOpen}
        onCancel={() => setIsBreakModalOpen(false)}
        onOk={() => setIsBreakModalOpen(false)}
        footer={null}
      >
        <BreakModal employeesDetails={employeeDetails} currentId={currentId} />
      </Modal>

      <div className="p-2 flex items-center justify-center gap-2">
        <Button onClick={handleCheckin} disabled={todayDetails?.isCheckedIn}>
          Checkin
        </Button>
        <Button onClick={handleCheckout} disabled={!todayDetails?.isCheckedIn}>
          Checkout
        </Button>
        <div className="gap-1 flex">
          <input
            type="checkbox"
            checked={todayDetails?.isOnBreak}
            onChange={handleBreaks}
            disabled={!todayDetails?.isCheckedIn}
          />
          Take a break
        </div>
      </div>
      <div className="flex items-center justify-center py-2 gap-2">
        {state?.user?.email}{" "}
        <Button danger type="primary" size="small" onClick={handleLogut}>
          Logout
        </Button>
      </div>
      <div className="border rounded-md p-2">
        <table className="w-full">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Breaks</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {employeeDetails.length > 0 ? (
              employeeDetails.map(({ id, checkin, checkout }, index) => (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{getDate(checkin as string)}</td>
                  <td>{getTime(checkin as string)}</td>
                  <td>{checkout && getTime(checkout as string)}</td>
                  <td>
                    <Button
                      onClick={() => {
                        setCurrentId((prev) => id);
                        setIsBreakModalOpen(true);
                      }}
                    >
                      Breaks
                    </Button>
                  </td>
                  <td>{calculateHours(checkin, checkout)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No Data!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;
