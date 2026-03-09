const primary = "#d25564";
import Select from "react-select";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? primary
      : state.isFocused
        ? `${primary}20` // light transparent hover
        : "white",
    color: state.isSelected ? "white" : "#0f172a",
    cursor: "pointer",
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: `${primary}20`,
  }),

  multiValueLabel: (provided) => ({
    ...provided,
    color: primary,
  }),

  multiValueRemove: (provided) => ({
    ...provided,
    color: primary,
    ":hover": {
      backgroundColor: primary,
      color: "white",
    },
  }),

  control: (provided, state) => ({
    ...provided,
    borderWidth: "1px", // force 1px
    borderStyle: "solid",
    // borderColor: primary, // always primary
    boxShadow: "none", // remove thick focus ring
    "&:hover": {
      borderColor: primary, // keep consistent
    },
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "160px",
    overflowY: "auto",
  }),
};

const DropdownReusable = ({
  options,
  placeholder = "Select option",
  setSelectedOption,
  selectedOption,
  isMultiple = false,
}) => {
  return (
    <>
      <section>
        <Select
          options={options}
          value={selectedOption}
          isMulti={isMultiple}
          styles={customStyles}
          formatOptionLabel={(option) =>
            option.label.charAt(0).toUpperCase() + option.label.slice(1)
          }
          menuPortalTarget={document.body}
          menuPosition="fixed"
          placeholder={placeholder}
          classNames={{
            menuList: () => "hide-scrollbar",
          }}
          onChange={(selectedOptions) => {
            setSelectedOption(selectedOptions);
          }}
        />
      </section>
    </>
  );
};

export default DropdownReusable;
