import React , { useState } from 'react';
import { Editable } from './Editable';
import { Preview } from './Preview';

export const StateContainer: React.FC = (props) => {
    const [value, setValue] = useState('# Hello World \n## Write in Markdown, see preview\n**bold** _italic_ \nTry typing markdown here');

    return (
        <>
            <Editable value={value} handleChange={setValue.bind(this)}/>
            <Preview text={value} />
        </>
        )
 }