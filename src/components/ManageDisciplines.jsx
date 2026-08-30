import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CreateRoom.css";
import "../styles/ManageDisciplines.css";
import Delete from "../assets/svg/Remove.svg";

const YEARS = [1, 2, 3, 4];
const emptyCourses = () => ({ 1: { on: false, hours: "" }, 2: { on: false, hours: "" }, 3: { on: false, hours: "" }, 4: { on: false, hours: "" } });

const ManageDisciplines = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [name, setName] = useState("");
    const [courses, setCourses] = useState(emptyCourses());
    const [list, setList] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`${apiUrl}/disciplines`).then((r) => setList(r.data)).catch(() => setError("Помилка завантаження дисциплін"));
    }, [apiUrl]);

    const toggle = (y) => setCourses((c) => ({ ...c, [y]: { ...c[y], on: !c[y].on } }));
    const setHours = (y, v) => setCourses((c) => ({ ...c, [y]: { ...c[y], hours: v } }));

    const submit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        const payload = YEARS.filter((y) => courses[y].on).map((y) => ({ year: y, hours: Number(courses[y].hours) || 0 }));
        try {
            const res = await axios.post(`${apiUrl}/disciplines`, { name: name.trim(), courses: payload });
            setList([...list, res.data]);
            setName("");
            setCourses(emptyCourses());
        } catch {
            setError("Помилка створення дисципліни");
        }
    };

    const remove = async (id) => {
        try {
            await axios.delete(`${apiUrl}/disciplines/${id}`);
            setList(list.filter((d) => d._id !== id));
        } catch {
            setError("Помилка видалення");
        }
    };

    return (
        <div className="MainCabinets">
            <div className="CabinetsTextDashboard">
                <p className="text">Дисципліни</p>
            </div>

            <form onSubmit={submit} className="discipline-form">
                <input
                    className="InputForAddCabinets discipline-name"
                    placeholder="Назва дисципліни"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <div className="course-grid">
                    {YEARS.map((y) => (
                        <label key={y} className={`course-toggle ${courses[y].on ? "active" : ""}`}>
                            <input type="checkbox" checked={courses[y].on} onChange={() => toggle(y)} />
                            <span className="course-toggle__label">Курс {y}</span>
                            <input
                                type="number"
                                min="0"
                                className="course-hours"
                                placeholder="год/сем"
                                value={courses[y].hours}
                                onChange={(e) => setHours(y, e.target.value)}
                                disabled={!courses[y].on}
                            />
                        </label>
                    ))}
                </div>
                <button type="submit" className="SubmitCabinets">Додати дисципліну</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <div className="discipline-list">
                {list.length === 0 ? (
                    <p className="discipline-empty">Ще немає дисциплін</p>
                ) : (
                    list.map((d) => (
                        <div key={d._id} className="Cabinet discipline-card">
                            <div className="discipline-card__info">
                                <span className="discipline-card__name">{d.name}</span>
                                <span className="discipline-card__courses">
                                    {d.courses && d.courses.length
                                        ? d.courses.sort((a, b) => a.year - b.year).map((c) => `Курс ${c.year} · ${c.hours} год`).join("   ")
                                        : "Курси не вказані"}
                                </span>
                            </div>
                            <div className="ButtonForCabinets">
                                <div className="DeleteRooms" onClick={() => remove(d._id)}>
                                    <img src={Delete} alt="Remove" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageDisciplines;
