import propTypes from "prop-types";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import UpdateUserModal from "../modals/UpdateUserModal";
import useDeleteUser from "../../hooks/useDeleteUser";
import ConfirmModal from "../modals/ConfirmModal";
import { Roles } from "../../constants/constants";
import { useAuthContext } from "../../context/AuthContext";

const UsersTable = ({
  users,
  setUsersListUpdCnt,
  showTools = true,
  allBranches,
}) => {
  const { authUser } = useAuthContext();

  const converDate = (lastUpdate) => {
    const date = new Date(lastUpdate);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedDate;
  };
  const [openUpdUserModal, setOpenUpdUserModal] = useState(false);
  const [deleteResponse, setDeleteResponse] = useState(false);
  const { deleteUser } = useDeleteUser();
  const [currUser, setCurrUser] = useState({});

  useEffect(() => {
    if (deleteResponse) {
      const deleteHandler = async () => {
        await deleteUser({
          userId: currUser.userId,
        });
        setDeleteResponse(false);
        setUsersListUpdCnt((prev) => prev + 1);
      };
      deleteHandler();
    }
  }, [deleteResponse, deleteUser, currUser.userId, setUsersListUpdCnt]);

  const confirmMessage = `Are you sure you want to delete this user?`;
  const yesMessage = "Delete";
  const noMessage = "Cancel";
  const toggalModalMessage = <Trash2 size={24} color={"red"} />;

  return (
    <>
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-sm uppercase bg-gray-200 dark:bg-gray-900 dark:text-gray-400 font-bold">
            <tr>
              {[
                "User Id",
                "Name",
                "Username",
                "Role",
                "Branch",
                "Created At",
                "Last Update",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-4 tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.userId}
                className={`border-b dark:border-gray-700 ${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                } hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${
                  user.userId === authUser._id && "bg-blue-200"
                }`}
              >
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {user.userId}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {user.username}
                </td>
                <td className="px-6 py-4 font-semibold text-white">
                  <span
                    className={`px-4 py-2 rounded-full ${
                      user.role === Roles.ADMIN ? "bg-red-500" : "bg-blue-500"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">{user.branchId}</td>
                <td className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">
                  {converDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">
                  {converDate(user.updatedAt)}
                </td>
                {showTools && (
                  <>
                    <td className="px-6 py-4 font-semibold hove">
                      <Pencil
                        size={20}
                        className="text-blue-600 cursor-pointer"
                        onClick={() => {
                          setOpenUpdUserModal(true), setCurrUser(user);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold hove">
                      {/* Delete branch */}
                      <div onClick={() => setCurrUser(user)}>
                        <ConfirmModal
                          confirmMessage={confirmMessage}
                          yesMessage={yesMessage}
                          noMessage={noMessage}
                          toggalModalMessage={toggalModalMessage}
                          setResponse={setDeleteResponse}
                        />
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {openUpdUserModal && (
          <UpdateUserModal
            showModal={openUpdUserModal}
            setShowModal={setOpenUpdUserModal}
            setUsersListUpdCnt={setUsersListUpdCnt}
            currUser={currUser}
            allBranches={allBranches}
          />
        )}
      </div>
    </>
  );
};

UsersTable.propTypes = {
  users: propTypes.array.isRequired,
  setUsersListUpdCnt: propTypes.func.isRequired,
  showTools: propTypes.bool,
  allBranches: propTypes.array.isRequired,
};

export default UsersTable;
