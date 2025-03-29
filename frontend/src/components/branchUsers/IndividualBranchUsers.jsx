import propTypes from "prop-types";
import BranchAccordion from "../accordion/BranchAccordion";
import UsersTable from "../table/UsersTable";
import { useState, useEffect } from "react";
import useGetUsersByBranchId from "@/hooks/useGetUsersByBranchId";
import Spinner from "../spinner/Spinner";

const IndividualBranchUsers = ({ branch, allBranches }) => {
  const [included, setIncluded] = useState(false);
  const [users, setUsers] = useState([]);
  const { loading, getUsers } = useGetUsersByBranchId();
  const [usersListUpdCnt, setUsersListUpdCnt] = useState(0);

  useEffect(() => {
    if (included) {
      const fetchUsers = async () => {
        const fetchedUsers = await getUsers({
          branchIds: [branch.branchId],
        });

        setUsers(fetchedUsers);
      };

      fetchUsers();
    } else setUsers([]);
  }, [included, getUsers, branch.branchId, usersListUpdCnt]);

  return (
    <div>
      <BranchAccordion
        included={included}
        setIncluded={() => setIncluded(!included)}
        branch={branch}
        setUsersListUpdCnt={setUsersListUpdCnt}
      />
      {included && (
        <div className="mt-4 mb-8 flex justify-center items-center">
          {loading ? (
            <Spinner
              loadingMessage={"Fetching Users..."}
              loadingMessageStyles={"!text-black !animate-none"}
              dotStyles={"!animate-none"}
            />
          ) : users?.length > 0 ? (
            <UsersTable
              users={users}
              setUsersListUpdCnt={setUsersListUpdCnt}
              allBranches={allBranches}
            />
          ) : (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-l-4 border-red-600 dark:border-red-400 px-6 py-6 rounded-lg shadow-lg max-w-lg text-center animate-fadeIn">
              <h2 className="text-3xl sm:text-4xl font-bold">No Users Found</h2>
              <p className="text-lg sm:text-xl mt-2">
                This branch doesn&apos;t have any users yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

IndividualBranchUsers.propTypes = {
  branch: propTypes.object.isRequired,
  allBranches: propTypes.array.isRequired,
};

export default IndividualBranchUsers;
