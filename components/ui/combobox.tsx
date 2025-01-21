import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { FormControl } from "./form";
import { Button } from "./button";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandInput, CommandItem, CommandList } from "./command";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  name: string;
};

interface ComboboxProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  items: Item[] | undefined;
  placeholder?: string;
  disabled?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({
  field,
  items,
  placeholder,
  disabled,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            disabled={disabled}
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value
              ? items && items.find((item) => item.id === field.value)?.name
              : placeholder}
            <ChevronDown className="ml-2 size-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            {items &&
              items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    field.onChange(item.id);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      field.value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
