"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat } from "@/lib/utils";
import apiClient from "@/lib/api";

interface DashboardUserDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleUserPage = ({ params }: DashboardUserDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [userInput, setUserInput] = useState<{
    email: string;
    newPassword: string;
    role: string;
  }>({
    email: "",
    newPassword: "",
    role: "",
  });
  const router = useRouter();

  const deleteUser = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    apiClient
      .delete(`/api/users/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 204) {
          toast.success("User deleted successfully");
          router.push("/admin/users");
        } else {
          throw Error("There was an error while deleting user");
        }
      })
      .catch((error) => {
        toast.error("There was an error while deleting user");
      });
  };

  const updateUser = async () => {
    if (
      userInput.email.length > 3 &&
      userInput.role.length > 0 &&
      userInput.newPassword.length > 0
    ) {
      if (!isValidEmailAddressFormat(userInput.email)) {
        toast.error("You entered invalid email address format");
        return;
      }

      if (userInput.newPassword.length > 7) {
        try {
          const response = await apiClient.put(`/api/users/${id}`, {
            email: userInput.email,
            password: userInput.newPassword,
            role: userInput.role,
          });

          if (response.status === 200) {
            await response.json();
            toast.success("User successfully updated");
          } else {
            const errorData = await response.json();
            toast.error(errorData.error || "Error while updating user");
          }
        } catch (error) {
          console.error("Error updating user:", error);
          toast.error("There was an error while updating user");
        }
      } else {
        toast.error("Password must be longer than 7 characters");
        return;
      }
    } else {
      toast.error("For updating a user you must enter all values");
      return;
    }
  };

  useEffect(() => {
    apiClient
      .get(`/api/users/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserInput({
          email: data?.email,
          newPassword: "",
          role: data?.role,
        });
      });
  }, [id]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 p-6 lg:p-8 w-full">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">User Details</h1>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md max-w-xl space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Leave blank or enter new password"
              className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              onChange={(e) =>
                setUserInput({ ...userInput, newPassword: e.target.value })
              }
              value={userInput.newPassword}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              User Role
            </label>
            <select
              className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 transition-all duration-200"
              value={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin" className="bg-slate-900 text-slate-200">admin</option>
              <option value="user" className="bg-slate-900 text-slate-200">user</option>
            </select>
          </div>

          <div className="flex gap-x-3 pt-2 max-sm:flex-col gap-y-3">
            <button
              type="button"
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm"
              onClick={updateUser}
            >
              Update User
            </button>
            <button
              type="button"
              className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold rounded-xl transition-all duration-200 text-sm"
              onClick={deleteUser}
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSingleUserPage;
