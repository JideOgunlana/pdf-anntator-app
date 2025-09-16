import React, { useState } from "react";
import { Rnd, RndResizeCallback, RndDragCallback } from "react-rnd";

type TextBox = {
  id: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function TextTool() {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);

  const addTextBox = () => {
    setTextBoxes((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "Edit text",
        x: 50,
        y: 50,
        width: 150,
        height: 40,
      },
    ]);
  };

  const updateTextBox = (id: number, updates: Partial<TextBox>) => {
    setTextBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, ...updates } : box))
    );
  };

  const handleDragStop: (id: number) => RndDragCallback =
    (id) => (_e, d) => {
      updateTextBox(id, { x: d.x, y: d.y });
    };

  const handleResizeStop: (id: number) => RndResizeCallback =
    (id) => (_e, _dir, ref, _delta, pos) => {
      updateTextBox(id, {
        width: parseInt(ref.style.width),
        height: parseInt(ref.style.height),
        x: pos.x,
        y: pos.y,
      });
    };

  return (
    <div className="w-screen h-screen relative bg-white">
      {/* Toolbar */}
      <div className="p-2 bg-gray-100 shadow-md">
        <button
          onClick={addTextBox}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Add Text
        </button>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[90%]">
        {textBoxes.map((box) => (
          <Rnd
            key={box.id}
            size={{ width: box.width, height: box.height }}
            position={{ x: box.x, y: box.y }}
            onDragStop={handleDragStop(box.id)}
            onResizeStop={handleResizeStop(box.id)}
            bounds="parent"
            style={{
              border: "1px solid #6666ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px",
              backgroundColor: "transparent",
            }}
          >
            <input
              type="text"
              value={box.text}
              onChange={(e) =>
                updateTextBox(box.id, { text: e.target.value })
              }
              className="w-full h-full outline-none border-none bg-transparent text-blue-600"
            />
          </Rnd>
        ))}
      </div>
    </div>
  );
}
