import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "./command";
import { cn } from "@/lib/utils";
import { FormControl } from "./form";

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
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between z-[1000]",
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
      <PopoverContent className="p-0 w-[200px] z-[1000]" align="start">
        <Command>
          <CommandInput
            autoFocus={true}
            placeholder={placeholder}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No hay resultados</CommandEmpty>
            <CommandGroup>
              {items &&
                items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={(currentValue) => {
                      field.onChange(
                        currentValue === field.value ? "" : currentValue
                      );
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
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
