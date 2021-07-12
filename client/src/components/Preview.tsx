import React from "react";
const marked = require("marked");

marked.setOptions({
    breaks: true
});

interface Props {
    text: string;
 }


export const Preview: React.FC<Props> = ({ text }) => {
    const toHTML = () => {
        return {__html: marked(text)}
     }


    return (<div dangerouslySetInnerHTML={toHTML() } className="preview"/>)
 }