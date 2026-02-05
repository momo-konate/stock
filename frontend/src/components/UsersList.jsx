import React from "react";
import { User, Trash2, Shield, UserCircle, Plus, Edit3 } from "lucide-react";

const UsersList = ({ users, isLoading, onDeleteUser, onCreateUser }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Gestion du Personnel
        </h2>
        <button
          onClick={() => onCreateUser()}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Ajouter un Vendeur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`p-3 rounded-2xl ${user.role === "admin" ? "bg-amber-50 text-amber-600" : "bg-primary-50 text-primary-600"}`}
              >
                {user.role === "admin" ? (
                  <Shield size={24} />
                ) : (
                  <UserCircle size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">
                  {user.username}
                </h3>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  user.role === "admin"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-primary-100 text-primary-700"
                }`}
              >
                {user.role === "admin" ? "Administrateur" : "Vendeur"}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => onCreateUser(user)}
                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                  title="Modifier les permissions"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Supprimer l'accès"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;
