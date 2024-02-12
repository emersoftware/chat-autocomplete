'use client';

import { useEffect, useState } from 'react';
import { useCompletion } from 'ai/react';
import { useRef } from 'react';

export default function Completion() {
  const { completion, setInput, input, complete, isLoading } = useCompletion({
    api: '/api/completion',
    onFinish(prompt, completion) {
      setCompletionText(completion);
    },
  });

  const divRef = useRef<HTMLDivElement>(null);

  const divStyle = {
    minHeight: '100px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '80%',
    margin: '0 auto',
    marginTop: '10px'
  }

  const [completionText, setCompletionText] = useState('');
  const [userText, setUserText] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setUserText(userText + completionText); // Agrega el texto de autocompletado al texto del usuario
      setCompletionText(''); // Limpia el texto de autocompletado
    }
  }
  
  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = `${userText}<span contenteditable="false" class='text-black/50'>${completionText}</span>`;
    }
  }, [userText, completionText]);

  const handleCompletion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (divRef.current) {
      setInput(divRef.current.innerText);
      setUserText(divRef.current.innerText);
    }
    complete(input);
    setCompletionText(completion);  
  }

  return (
    <div className="flex flex-col space-y-2 w-full mt-2 relative">
      <div className="flex flex-row items-start">
        <div
          contentEditable="plaintext-only"
          className="text-black bg-white w-full"
          onKeyDown={handleKeyDown}
          style={divStyle}
          suppressContentEditableWarning={true}
          ref={divRef}
        />
      </div>

      <form onSubmit={handleCompletion} className=" text-white space-y-2">
        <span className="text-red-600">{input}</span>
        <span className="text-blue-600">{completionText}</span>
        <button disabled={isLoading} type="submit">
          Completar
        </button>
      </form>

    </div>
  );
}
