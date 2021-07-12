import React from "react";

interface Props {
    handleChange: (event: string) => void;
    value: string;
 }

export const Editable: React.FC<Props> = ({handleChange, value}) => {

    return (
        <textarea
            value={value}
            onChange={(event) => { handleChange(event.target.value); }}
        />
    );
};