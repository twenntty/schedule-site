import React, { useState, useEffect } from "react";
import axios from "axios";

const MembersList = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/users", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMembers(response.data);
            } catch (error) {
                console.error("Ошибка загрузки пользователей:", error);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div>
            <h2>Список пользователей</h2>
            {members.length === 0 ? (
                <p>Нет зарегистрированных пользователей</p>
            ) : (
                <ul>
                    {members.map((member) => (
                        <li key={member._id}>
                            <strong>{member.firstName} {member.lastName}</strong> - {member.position} ({member.role})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MembersList;
