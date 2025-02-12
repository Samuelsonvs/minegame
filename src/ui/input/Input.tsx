import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";

interface NumberInputProps {
    value: number;
    setValue: (val: number) => void;
}

export default function NumberInput({ value, setValue }:NumberInputProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = Number(event.target.value);

        // Ensure the number is at least 1
        if (newValue < 1 || isNaN(newValue)) {
            newValue = 1;
        }

        setValue(newValue);
    };

    return (
        <div className="w-full max-w-md px-4">
            <Field>
                <Label className="text-sm/6 font-medium text-white">
                    Bet Price
                </Label>
                <Input
                    type="number"
                    min={1}
                    value={value}
                    onChange={handleChange}
                    className={clsx(
                        "md:mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                    )}
                />
            </Field>
        </div>
    );
}
