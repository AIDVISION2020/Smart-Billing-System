/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";

const Dropdown = ({
  dropDownElements,
  dropDownStyles,
  openButton = <EllipsisVertical size={16} />,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // To handle clicks outside of the dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-end" ref={dropdownRef}>
      <button
        id="dropdownButton"
        className={`${dropDownStyles}`}
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
        }}
        type="button"
      >
        {openButton}
      </button>
      <div
        id="dropdown"
        className={`z-50 ${
          isDropdownOpen ? "block" : "hidden"
        } absolute text-base list-none bg-gray-300 divide-y rounded-xl shadow px-1 top-20 border-4 border-gray-800`}
      >
        <ul className="py-2 space-y-1" aria-labelledby="dropdownButton">
          {dropDownElements.map((element, index) => {
            return <li key={index}>{element}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
