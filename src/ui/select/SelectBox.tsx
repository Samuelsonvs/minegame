import { Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface SelectBoxProps {
    selected: number;
    setSelected: (val: number) => void;
}

export default function SelectBox({ selected, setSelected }: SelectBoxProps) {
    return (
        <div className="w-full max-w-md px-4">
            <Field>
                <Label className="text-sm font-medium text-white mb-2 block">
                    Mines
                </Label>

                <div className="relative">
                    <Select
                        value={selected}
                        onChange={(e) => setSelected(Number(e.target.value))} // Convert to number
                        className={clsx(
                            "mt-2 block w-full rounded-lg border border-white/10 bg-white/10 py-2 px-4 text-white",
                            "focus:outline-none focus:ring-2 focus:ring-white/25 focus:ring-offset-2 focus:ring-offset-black",
                            "hover:bg-white/20 transition-all duration-150 ease-in-out",
                            "appearance-none pr-10"
                        )}
                        aria-label="Select number of mines"
                    >
                        {Array.from({ length: 22 }, (_, i) => i + 3).map(
                            (num) => (
                                <option
                                    key={num}
                                    value={num}
                                    className="text-black"
                                >
                                    {num}
                                </option>
                            )
                        )}
                    </Select>

                    {/* Dropdown Icon */}
                    <ChevronDownIcon
                        className="absolute top-3 right-3 size-5 text-white pointer-events-none"
                        aria-hidden="true"
                    />
                </div>
            </Field>
        </div>
    );
}
