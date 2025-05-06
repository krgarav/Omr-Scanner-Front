import React, { useEffect } from "react";

const FormData = ({
  setCurrentBoxData,
  currentBoxData,
  setBoxes,
  activeBox,
  allBubbles,
  isNewBox,
  setIsOpen,
}) => {
  useEffect(() => {
    if (isNewBox) {
      setCurrentBoxData({});
    }
  }, [isNewBox]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!currentBoxData) {
      alert("Please fill all the fields");
      return;
    }
    if (isNewBox) {
      setBoxes((prevBoxes) => [
        ...prevBoxes,
        {
          ...currentBoxData,
          x: 100,
          y: 100,
          width: 150,
          height: 100,
        },
      ]);
      setCurrentBoxData({});
      setIsOpen(false);
    } else {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box, idx) =>
          idx === activeBox ? { ...currentBoxData } : box
        )
      );
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Box Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="totalCol"
            className="block text-sm font-medium text-gray-700"
          >
            Row:
          </label>
          <input
            type="number"
            id="totalCol"
            value={currentBoxData?.totalCol}
            onChange={(e) =>
              setCurrentBoxData((prev) => ({
                ...prev,
                totalCol: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="totalRow"
            className="block text-sm font-medium text-gray-700"
          >
            Col:
          </label>
          <input
            type="number"
            id="totalRow"
            value={currentBoxData?.totalRow}
            onChange={(e) =>
              setCurrentBoxData((prev) => ({
                ...prev,
                totalRow: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="fieldName"
            className="block text-sm font-medium text-gray-700"
          >
            Field Name:
          </label>
          <input
            type="text"
            id="fieldName"
            value={currentBoxData?.fieldName}
            onChange={(e) =>
              setCurrentBoxData((prev) => ({
                ...prev,
                fieldName: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="fieldType"
            className="block text-sm font-medium text-gray-700"
          >
            Field Type:
          </label>
          <select
            id="fieldType"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            onChange={(e) =>
              setCurrentBoxData((prev) => ({
                ...prev,
                fieldType: e.target.value,
              }))
            }
          >
            <option value="alphabet" className="cursor-pointer">
              Alphabet
            </option>
            <option value="integer" className="cursor-pointer">
              Integer
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="readingDirection"
            className="block text-sm font-medium text-gray-700"
          >
            Reading Direction:
          </label>
          <select
            id="readingDirection"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) =>
              setCurrentBoxData((prev) => ({
                ...prev,
                ReadingDirection: e.target.value,
              }))
            }
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="readingDirection"
            className="block text-sm font-medium text-gray-700"
          >
            Allow Multiple:
          </label>
          <select
            id="allowMultiple"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) =>
              setCurrentBoxData((prev) => ({
                ...prev,
                allowMultiple: e.target.value,
              }))
            }
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="margin"
            className="block text-sm font-medium text-gray-700"
          >
            Margin:
          </label>
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            id="margin"
            title={currentBoxData?.gap}
            value={currentBoxData?.gap}
            onChange={(e) => {
              setCurrentBoxData((prev) => ({
                ...prev,
                gap: e.target.value,
              }));
              setBoxes((prevBoxes) =>
                prevBoxes.map((box, idx) =>
                  idx === activeBox ? { ...box, gap: e.target.value } : box
                )
              );
            }}
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="sensitivity"
            className="block text-sm font-medium text-gray-700"
          >
            Sensitivity:
          </label>
          <input
            type="range"
            min={0.01}
            max={0.9}
            step={0.01}
            id="sensitivity"
            value={currentBoxData?.bubbleIntensity}
            onChange={(e) => {
              setCurrentBoxData((prev) => ({
                ...prev,
                bubbleIntensity: e.target.value,
              }));
            }}
            className="w-full"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default FormData;
