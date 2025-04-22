import { useState, useEffect } from "react";
import { Check, X, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UserRoleConfirmation() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/getAllUsers");
      if (!response.ok) {
        throw new Error("Problème lors de la récupération des utilisateurs");
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(t("Erreur lors du chargement des utilisateurs: ") + err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmUser = async (id) => {
    try {
      setConfirmingId(id);
      const response = await fetch(`http://localhost:8000/api/Confirmer/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Problème lors de la confirmation");
      }

      // Mise à jour de l'état local après confirmation
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, is_confirmed: 1 } : user
        )
      );
      
      setSuccessMessage(`t(L'utilisateur avec l'ID) ${id} t(a été confirmé avec succès!)`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(t("Erreur lors de la confirmation: ") + err.message);
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-blue-600">{t("Chargement des utilisateurs...")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
        <button 
          onClick={fetchUsers}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          {t("Réessayer")}
        </button>
      </div>
    );
  }
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className={`min-h-screen md:w-full mx-auto p-4 bg-gray-50 ${user.role === 'admin' ? 'w-[370px]' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("Gestion des confirmations d'utilisateurs")}</h1>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("ID")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Nom")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Email")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Rôle")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Statut")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Action")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.profile_image ? (
                          <img 
                            src={"http://localhost:8000/storage/" + user.profile_image}
                            alt={user.name} 
                            className="h-10 w-10 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                            <span className="text-gray-600">{user.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_confirmed === 1 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {t("Confirmé")}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {t("En attente")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.is_confirmed === 0 ? (
                        <button
                          onClick={() => confirmUser(user.id)}
                          disabled={confirmingId === user.id}
                          className={`inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                    ${confirmingId === user.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          {confirmingId === user.id ? (
                            "Traitement..."
                          ) : (
                            <>
                              <Check size={16} className="mr-1" />
                              {t("Confirmer")}
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-green-600 flex items-center">
                          <Check size={16} className="mr-1" />
                          {t("Confirmé")}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {t("Aucun utilisateur trouvé")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}