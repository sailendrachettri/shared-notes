import React from 'react'
import { useState } from 'react'

const CreateNewWorkSpace = ({setIsOpen, setSelectedTab}) => {
    const [submitting, setSubmitting] = useState(false);
  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
          <h3 className="text-lg font-semibold mb-4">Create New Note</h3>

          <form>
            {/* {isUserLoggedIn ? (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Private by default.</span>
                  <span className="ps-1">
                    You can choose to make this note public.
                  </span>
                </p>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary"
                    onChange={(e) => setMakeItPublic(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">
                    Make this note public
                  </span>
                </label>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100  mb-4">
                <p className="text-sm text-slate-500 font-medium">
                  You are creating a public note.
                </p>
                <p className="text-xs text-slate-500 0 mt-1">
                  Anyone with access will be able to view it.
                </p>
              </div>
            )}

            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full capitalize border border-primary rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
              maxLength={45}
              minLength={3}
            /> */}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedTab(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              {/* <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                >
                  Create
                </button> */}
              <button
                disabled={submitting}
                type="submit"
                // onClick={() => {
                //   handleSubmit();
                // }}
                className={`${submitting ? "bg-slate-300 text-slate-700 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"} px-4 py-2 rounded-lg transition`}
              >
                {`${submitting ? "Creating.." : "Create"}`}
              </button>
            </div>
          </form>
        </div>

        {/* Click outside to close */}
        <div
          className="absolute inset-0 -z-10"
          onClick={() => {setSelectedTab(null); setIsOpen(false)}}
        />
      </div>
    </>
  )
}

export default CreateNewWorkSpace