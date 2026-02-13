import React from 'react'

const CreaterNewNotesForm = () => {
  return (
    <div>
         <div className="px-6 border-b border-gray-200">
        <h2 className="text-sm p-2 font-semibold text-gray-800">
          All Notes
        </h2>
      </div>

        <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition">
          + New Project
        </button>
      </div>
    </div>
  )
}

export default CreaterNewNotesForm