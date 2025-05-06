import React from 'react'
import './AddUniveristy.css'


const AddUniveristy = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      className="button_add_university"
      onClick={() => scrollToSection("form")}
    >
      Долучитись до Sched GO
    </button>
  );
};

export default AddUniveristy;