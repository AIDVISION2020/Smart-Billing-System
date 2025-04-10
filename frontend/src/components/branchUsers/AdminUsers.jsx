import BranchAccordion from "../accordion/ManageUsers_BranchAccordion";
import { useState, useEffect } from "react";
import useGetUsersByBranchId from "@/hooks/useGetUsersByBranchId";
import Spinner from "../spinner/Spinner";
import UsersTable from "../table/UsersTable";

const AdminUsers = () => {
  const [included, setIncluded] = useState(false);
  const [users, setUsers] = useState([]);
  const { loading, getUsers } = useGetUsersByBranchId();
  const [usersListUpdCnt, setUsersListUpdCnt] = useState(0);

  useEffect(() => {
    if (included) {
      const fetchUsers = async () => {
        const fetchedUsers = await getUsers({
          branchIds: ["0"],
        });

        setUsers(fetchedUsers);
      };
      fetchUsers();
    } else setUsers([]);
  }, [included, getUsers, usersListUpdCnt]);

  const branch = {
    branchId: "0",
    branchName: "Admin",
  };

  return (
    <div>
      <BranchAccordion
        included={included}
        setIncluded={() => setIncluded(!included)}
        branch={branch}
        setUsersListUpdCnt={setUsersListUpdCnt}
      />
      {included && (
        <div className="mt-4 mb-8">
          {loading ? (
            <Spinner
              loadingMessage={"Fetching Users..."}
              loadingMessageStyles={"!text-black !animate-none"}
              dotStyles={"!animate-none"}
            />
          ) : (
            <UsersTable
              users={users}
              setUsersListUpdCnt={setUsersListUpdCnt}
              showTools={false}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
