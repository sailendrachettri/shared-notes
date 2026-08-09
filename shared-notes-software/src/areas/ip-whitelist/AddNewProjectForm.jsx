import React, { useRef, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiFile,
  FiInfo,
  FiKey,
  FiLock,
  FiServer,
  FiDatabase,
  FiUploadCloud,
  FiX,
  FiEye,
  FiEyeOff,
  FiLoader,
} from "react-icons/fi";
import { axiosInstance } from "../../api/axios";
import { ADD_PROJECT_URL, FILE_UPLOAD_URL } from "../../api/api_routes";
import { customToast } from "../../utils/toast/toastConfig";

const AddNewProjectForm = ({setAddNewProject}) => {
  const fileInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [privateKey, setPrivateKey] = useState(null);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    serverHost: "",
    sshUsername: "",
    sshPort: "22",
    sshPassphrase: "",
    sshPassword: "",
    postgresPort: "5432",
    environment: "Production",
    notes: "",
    enabled: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["pem", "ppk", "key"].includes(extension)) {
      alert("Please select a .pem, .ppk or .key file.");
      e.target.value = "";
      return;
    }

    console.log({ file });

    setPrivateKey(file);
  };

  const removePrivateKey = () => {
    setPrivateKey(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    setSubmitting(true);

    try {
      e.preventDefault();

      let fileRes;

      if (privateKey) {
        const formData = new FormData();
        formData.append("files", privateKey);
        fileRes = await axiosInstance.post(FILE_UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const uploadedUrl = fileRes?.data?.files[0]?.file;

      console.log({ uploadedUrl });

      const payload = {
        projectName: formData?.projectName,
        envType: formData?.environment,
        description: formData?.description,

        serverHost: formData?.serverHost,

        sshUsername: formData?.sshUsername,
        sshPort: Number(formData?.sshPort),

        pathToPrivateFile: uploadedUrl,

        keyPassphrase: formData?.sshPassphrase,
        sshPassword: formData?.sshPassword,

        postgresPort: Number(formData?.postgresPort),
        isActive: true,
      };

      console.log("Project:", payload);

      const res = await axiosInstance.post(ADD_PROJECT_URL, payload);
      console.log({ res });

      if (res.data.success == true && res.data.ip_whitelist_id > 0) {
        customToast.success("Project added successful");
        setAddNewProject(false);
      } else {
        customToast.error("Not able to add the project at the moment");
      }
    } catch (error) {
      customToast.error(
        "Server error: Not able to add the project at the moment",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] py-8">
      <div className="mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ------------------------------------------------ */}
          {/* Project Information */}
          {/* ------------------------------------------------ */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                  <FiInfo size={18} className="text-[var(--color-primary)]" />
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--color-secondary)]">
                    Project Information
                  </h2>

                  <p className="text-xs text-gray-400">
                    Basic information about this project.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
              {/* Project Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Name{" "}
                  <span className="text-[var(--color-primary)]">*</span>
                </label>

                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="e.g. Citizen Bank"
                  required
                  className="
                    w-full rounded-lg
                    border border-gray-200
                    bg-white px-3.5 py-2.5
                    text-sm outline-none
                    transition
                    placeholder:text-gray-300
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />
              </div>

              {/* Environment */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Environment
                </label>

                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  className="
                    w-full rounded-lg
                    border border-gray-200
                    bg-white px-3.5 py-2.5
                    text-sm outline-none
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short description of this project"
                  className="
                    w-full rounded-lg
                    border border-gray-200
                    px-3.5 py-2.5
                    text-sm outline-none
                    placeholder:text-gray-300
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />
              </div>
            </div>
          </section>

          {/* ------------------------------------------------ */}
          {/* SSH Connection */}
          {/* ------------------------------------------------ */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-secondary)]/10">
                  <FiServer
                    size={18}
                    className="text-[var(--color-secondary)]"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--color-secondary)]">
                    SSH Connection
                  </h2>

                  <p className="text-xs text-gray-400">
                    Credentials used to connect to the Droplet.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
              {/* Server IP */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Server IP / Hostname{" "}
                  <span className="text-[var(--color-primary)]">*</span>
                </label>

                <input
                  type="text"
                  name="serverHost"
                  value={formData.serverHost}
                  onChange={handleChange}
                  placeholder="e.g. 165.232.178.33"
                  required
                  className="
                    w-full rounded-lg
                    border border-gray-200
                    px-3.5 py-2.5
                    font-mono text-sm
                    outline-none
                    placeholder:font-sans
                    placeholder:text-gray-300
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />
              </div>

              {/* SSH Username */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  SSH Username{" "}
                  <span className="text-[var(--color-primary)]">*</span>
                </label>

                <input
                  type="text"
                  name="sshUsername"
                  value={formData.sshUsername}
                  onChange={handleChange}
                  placeholder="e.g. root"
                  required
                  className="
                    w-full rounded-lg
                    border border-gray-200
                    px-3.5 py-2.5
                    font-mono text-sm
                    outline-none
                    placeholder:font-sans
                    placeholder:text-gray-300
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />
              </div>

              {/* SSH Port */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  SSH Port{" "}
                  <span className="text-[var(--color-primary)]">*</span>
                </label>

                <input
                  type="number"
                  name="sshPort"
                  value={formData.sshPort}
                  onChange={handleChange}
                  min="1"
                  max="65535"
                  required
                  className="
                    w-full rounded-lg
                    border border-gray-200
                    px-3.5 py-2.5
                    font-mono text-sm
                    outline-none
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />
              </div>

              {/* Private Key */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  SSH Private Key{" "}
                  <span className="text-[var(--color-primary)]">*</span>
                </label>

                {!privateKey ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="
                      flex w-full
                      flex-col items-center justify-center
                      rounded-xl
                      border-2 border-dashed border-gray-200
                      bg-gray-50/50
                      px-6 py-8
                      transition
                      hover:border-[var(--color-primary)]/50
                      hover:bg-[var(--color-primary)]/[0.02]
                    "
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                      <FiUploadCloud
                        size={21}
                        className="text-[var(--color-primary)]"
                      />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      Upload private key
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      .pem, .ppk or .key files
                    </p>
                  </button>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                        <FiKey
                          size={18}
                          className="text-[var(--color-primary)]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-700">
                          {privateKey.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {(privateKey.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removePrivateKey}
                      className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-[var(--color-primary)]"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pem,.ppk,.key"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                  <FiLock size={12} />
                  Private keys are used only for SSH authentication.
                </p>
              </div>

              {/* Passphrase */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Key Passphrase
                </label>

                <div className="relative">
                  <input
                    type={showPassphrase ? "text" : "password"}
                    name="sshPassphrase"
                    value={formData.sshPassphrase}
                    onChange={handleChange}
                    placeholder="Enter key passphrase"
                    className="
                      w-full rounded-lg
                      border border-gray-200
                      px-3.5 py-2.5 pr-10
                      text-sm outline-none
                      placeholder:text-gray-300
                      focus:border-[var(--color-primary)]
                      focus:ring-2
                      focus:ring-[var(--color-primary)]/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassphrase ? (
                      <FiEyeOff size={17} />
                    ) : (
                      <FiEye size={17} />
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Leave empty if your private key has no passphrase.
                </p>
              </div>

              {/* SSH Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  SSH Password
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    Optional
                  </span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="sshPassword"
                    value={formData.sshPassword}
                    onChange={handleChange}
                    placeholder="Server password"
                    className="
                      w-full rounded-lg
                      border border-gray-200
                      px-3.5 py-2.5 pr-10
                      text-sm outline-none
                      placeholder:text-gray-300
                      focus:border-[var(--color-primary)]
                      focus:ring-2
                      focus:ring-[var(--color-primary)]/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FiEyeOff size={17} />
                    ) : (
                      <FiEye size={17} />
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Usually not required when using SSH key authentication.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------ */}
          {/* PostgreSQL */}
          {/* ------------------------------------------------ */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-ternary)]/30">
                  <FiDatabase
                    size={18}
                    className="text-[var(--color-secondary)]"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--color-secondary)]">
                    PostgreSQL
                  </h2>

                  <p className="text-xs text-gray-400">
                    Database port that should be accessible.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="max-w-sm">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  PostgreSQL Port{" "}
                  <span className="text-[var(--color-primary)]">*</span>
                </label>

                <input
                  type="number"
                  name="postgresPort"
                  value={formData.postgresPort}
                  onChange={handleChange}
                  min="1"
                  max="65535"
                  required
                  className="
                    w-full rounded-lg
                    border border-gray-200
                    px-3.5 py-2.5
                    font-mono text-sm
                    outline-none
                    focus:border-[var(--color-primary)]
                    focus:ring-2
                    focus:ring-[var(--color-primary)]/10
                  "
                />

                <p className="mt-2 text-xs text-gray-400">
                  Default PostgreSQL port is 5432.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------ */}
          {/* Footer Actions */}
          {/* ------------------------------------------------ */}

          <div className="flex items-center justify-end gap-3 pb-8">
            <button
            onClick={()=>{setAddNewProject(false)}}
              type="button"
              className="
                rounded-lg
                border border-gray-200
                bg-white
                px-5 py-2.5
                text-sm font-semibold
                text-gray-600
                transition
                hover:bg-gray-50 cursor-pointer
              "
            >
              Cancel
            </button>
            <button
  type="submit"
  disabled={submitting}
  className={`
    flex items-center gap-2
    rounded-lg
    px-5 py-2.5
    text-sm font-semibold
    shadow-sm
    transition
    ${
      submitting
        ? "cursor-not-allowed bg-slate-300 text-slate-600"
        : "cursor-pointer bg-[var(--color-primary)] text-white hover:brightness-95 active:scale-[0.98]"
    }
  `}
>
  {submitting ? (
    <>
      <FiLoader
        size={17}
        className="animate-spin"
      />
      Saving...
    </>
  ) : (
    <>
      <FiCheck size={17} />
      Save Project
    </>
  )}
</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProjectForm;
