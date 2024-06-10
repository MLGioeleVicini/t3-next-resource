import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { type CellContext } from "@tanstack/react-table";
import { type Resources } from "@prisma/client";

const EditableCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<Resources, unknown>) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = (): void => {
    table.options.meta?.updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value as string}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onBlur={onBlur}
    />
  );
};

export default EditableCell;
