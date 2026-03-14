import noResultImp from "../../assets/svgs/noresult2.svg";

const NoResultFound = ({ img, title, desc }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center py-10 px-6">
      {/* Illustration */}
      <img
        src={img || noResultImp}
        alt="No result"
        className="w-48 md:w-56 mb-6 select-none opacity-20"
      />

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-700 mb-2 opacity-80">
        {title || "Nothing to show here"}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed opacity-80">
        {desc ||
          "There are no items available right now. Try creating a new one or check back later."}
      </p>
    </div>
  );
};

export default NoResultFound;
