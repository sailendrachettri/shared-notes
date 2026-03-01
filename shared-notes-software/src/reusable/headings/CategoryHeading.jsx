
import { IoIosArrowUp } from "react-icons/io";

const CategoryHeading = ({
  OnclickOne,
  OnclickTwo,
  categoryHeaing,
  size = 0,
  toggle
}) => {
  return (
    <>
      <div className="flex flex-nowrap justify-between items-center min-h-7">
        <div
          onClick={OnclickOne}
          className={`ps-1 text-sm font-semibold text-slate-600`}
        >
          {categoryHeaing || ''}
        </div>

        <section>
          <div className="group-hover:hidden">
           {size > 0 && <span
              className="inline-flex items-center justify-center 
                   min-w-5 h-5 px-1.5
                   bg-primary/5 text-primary/60
                   text-[10px] font-semibold 
                   rounded-full"
            >
              { size}
            </span>}
          </div>

          <div
            className="hidden group-hover:block text-slate-400"
            onClick={OnclickTwo}
          >
            {toggle ? (
              <IoIosArrowUp className="rotate-180 cursor-pointer hover:text-slate-500" />
            ) : (
              <IoIosArrowUp className="cursor-pointer hover:text-slate-500" />
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoryHeading;
