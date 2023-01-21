import { useEffect, useMemo, useRef, useState } from "react";

function number(num) {
  if (isNaN(+num)) return 0;

  return +num;
}

export default function Home() {
  const [count, setCount] = useState(1);
  const [input, setInput] = useState();
  const [result, setResult] = useState(0);
  const [types, setTypes] = useState([]);

  const numberInput = useMemo(() => number(input), [input]);
  const numberCount = useMemo(() => number(count), [count]);

  const fieldsWithoutRef = types.map((field) => ({
    value: field.value,
    type: field.type,
  }));

  const addType = () => {
    const copyTypes = structuredClone(fieldsWithoutRef);

    copyTypes.push({ type: "add", value: "" });

    setTypes(copyTypes);
  };

  const calculate = () => {
    const calcTypes = types.reduce((prev, curr) => {
      const prevNumber = number(prev);
      const currNumber = number(curr?.value);
      if (curr.type === "add") {
        return prevNumber + prevNumber * (currNumber / 100);
      }

      if (curr.type === "subtract") {
        return prevNumber - prevNumber * (currNumber / 100);
      }

      return prev;
    }, numberCount * numberInput);

    setResult(calcTypes);
  };

  const handleChangeType = (val, index) => {
    const copyTypes = structuredClone(fieldsWithoutRef);

    copyTypes[index] = val;

    setTypes(copyTypes);
  };

  const handleRowDelete = (index) => {
    const copyTypes = structuredClone(fieldsWithoutRef);

    copyTypes.splice(index, 1);

    setTypes(copyTypes);
  };

  useEffect(() => {
    const lastInputRef = types[types.length - 1]?.inputRef;
    lastInputRef?.focus?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types.length]);

  return (
    <div className="container mx-auto md:max-w-xl md:border md:rounded-md pl-2 pr-6 md:px-6 py-4 mt-3 md:mt-10">
      <h1 className="text-center font-bold pb-4 text-lg">Yüzde Hesaplama</h1>
      <div className="space-y-4">
        <div className="flex items-center gap-x-4">
          <label className="text-sm text-zinc-500 w-[4.5rem] block text-end">
            Birim Fiyat
          </label>
          <input
            value={input}
            className="border rounded-md px-2 py-2 flex-1"
            type="number"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-x-4">
          <label className="text-sm text-zinc-500 w-[4.5rem] block text-end">
            Adet
          </label>
          <input
            value={count}
            className="border rounded-md px-2 py-2 flex-1"
            type="number"
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        {types.map((_input, index) => (
          <div className="flex items-center gap-x-4" key={index}>
            <button
              className="text-sm text-zinc-500 w-[4.5rem] block text-end cursor-pointer"
              onClick={() =>
                handleChangeType(
                  {
                    type: _input.type === "add" ? "subtract" : "add",
                    value: _input.value,
                  },
                  index
                )
              }
            >
              {_input.type === "subtract" ? "% İskonto" : "% Arttır"}
            </button>
            <div className="flex items-center flex-1 gap-x-2 relative">
              <input
                type="number"
                value={_input.value}
                ref={(e) => (_input.inputRef = e)}
                className="border rounded-md px-2 py-2 flex-1"
                onChange={(e) =>
                  handleChangeType(
                    { type: _input.type, value: e.target.value },
                    index
                  )
                }
              />
              <button
                className="absolute -right-3 text-red-400"
                onClick={() => handleRowDelete(index)}
              >
                x
              </button>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-x-4">
          <div className="w-[4.5rem]"></div>
          <button
            className="text-blue-500 text-sm font-medium"
            onClick={addType}
          >
            + Alan Ekle
          </button>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="w-[4.5rem]"></div>
          <button
            className="bg-blue-500 text-white text-sm font-medium flex-1 px-2 py-2 rounded-md"
            onClick={calculate}
          >
            Hesapla
          </button>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="w-[4.5rem]"></div>
          <div className="flex items-center gap-x-2">
            <strong className="font-medium">Sonuç: </strong>
            <span>{number(result).toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
