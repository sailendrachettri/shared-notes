import React from 'react'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'

const WhiteListOptionMenu = ({ setSelectedProjectId, setIsDeleteOpen , selectedMenuCardId, setShowMenu}) => {
  return (
    <div
      className="
        absolute
        right-2
        top-10
        z-50
        w-40
        rounded-lg
        border border-gray-200
        bg-white
        p-1
        shadow-lg
      "
    >
      <button
        // onClick={onView}
        className="
          flex w-full items-center gap-2
          rounded-md px-3 py-2
          text-sm text-gray-600
          hover:bg-gray-100
        "
      >
        <FiEye size={16} />
        View
      </button>

      <button
        // onClick={onEdit}
        className="
          flex w-full items-center gap-2
          rounded-md px-3 py-2
          text-sm text-gray-600
          hover:bg-gray-100
        "
      >
        <FiEdit2 size={16} />
        Edit
      </button>

      <button
        onClick={()=>{setSelectedProjectId(selectedMenuCardId); setShowMenu(false); setIsDeleteOpen(true); }}
        className="
          flex w-full items-center gap-2
          rounded-md px-3 py-2
          text-sm text-red-500
          hover:bg-red-50
        "
      >
        <FiTrash2 size={16} />
        Delete
      </button>
    </div>
  )
}

export default WhiteListOptionMenu